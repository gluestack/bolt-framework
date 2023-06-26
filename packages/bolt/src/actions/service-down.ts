import chalk from "chalk";

import { exitWithMsg } from "../helpers/exit-with-msg";
import getStore from "../helpers/get-store";
import { updateStore } from "../helpers/update-store";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";

import Docker from "../runners/docker";
import Local from "../runners/local";

import Common from "../common";

import { StoreService, StoreServices } from "../typings/store-service";
import { Bolt } from "../typings/bolt";

export default class ServiceDown {
  public async checkIfAlreadyDown(_yamlContent: any, serviceName: string) {
    const store = await getStore();
    const data: StoreServices = store.get("services") || [];
    const service = data[serviceName];
    if (service && service.status === "down") {
      await exitWithMsg(`>> "${serviceName}" service is already down`);
    }

    return service;
  }

  public async checkAllServiceDown(_yamlContent: Bolt) {
    const store = await getStore();
    const data: StoreServices = store.get("services") || {};

    const services = _yamlContent.services;

    let allServiceDown = true;
    Object.entries(services).forEach(([serviceName]) => {
      if (data[serviceName] && data[serviceName].status !== "down") {
        allServiceDown = false;
        return;
      }
    });

    return allServiceDown;
  }

  public async handle(serviceName: string) {
    const { _yamlContent } = await Common.validateServiceInBoltYaml(
      serviceName
    );

    // Validations for metadata and services
    await validateMetadata();
    await validateServices();

    const { servicePath, content } = await Common.getAndValidateService(
      serviceName,
      _yamlContent
    );

    const service: StoreService = await this.checkIfAlreadyDown(
      _yamlContent,
      serviceName
    );

    const serviceRunner = service.serviceRunner;

    if (!service || !serviceRunner) {
      await exitWithMsg(`>> "${serviceName}" service is not running`);
      return;
    }

    {
      const { envfile, build } = content.service_runners[serviceRunner];
      switch (serviceRunner) {
        case "docker":
          await Docker.stop(
            content.container_name,
            servicePath,
            build,
            [],
            envfile
          );
          break;
        case "local":
          const processId: number = Number(service.processId) || 0;
          await Local.stop(processId);
          break;
      }
    }

    const json: StoreService = {
      status: "down",
      serviceRunner: null,
      port: null,
      processId: null,
    };

    await updateStore("services", serviceName, json);

    const isAllServiceDown = await this.checkAllServiceDown(_yamlContent);

    if (isAllServiceDown) {
      await updateStore("project_runner", "none");
    }

    console.log(
      chalk.green(`\n"${serviceName}" is down from ${serviceRunner} platform\n`)
    );
  }
}
