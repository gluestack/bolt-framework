import chalk from "chalk";

import { exitWithMsg } from "../helpers/exit-with-msg";
import getStore from "../helpers/get-store";
import { updateStore } from "../helpers/update-store";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";

import Common from "../common";

import {
  ProjectRunners,
  StoreService,
  StoreServices,
} from "../typings/store-service";
import { Bolt } from "../typings/bolt";
import ServiceRunner from "../runners/service";
import { DockerConfig, LocalConfig } from "../typings/project-runner-config";
import { getStoreData } from "../helpers/get-store-data";

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

    const currentServiceRunner = service.serviceRunner;

    if (!service || !currentServiceRunner) {
      await exitWithMsg(`>> "${serviceName}" service is not running`);
      return;
    }

    const projectRunner: ProjectRunners = await getStoreData("project_runner");
    if (projectRunner === "vm") {
      await exitWithMsg(
        `>> ${_yamlContent.project_name} is running in VM. Run "bolt down" to stop the project!`
      );
      return;
    }

    const { envfile, build } = content.service_runners[currentServiceRunner];

    const serviceRunner = new ServiceRunner();
    switch (currentServiceRunner) {
      case "docker":
        const dockerConfig: DockerConfig = {
          containerName: content.container_name,
          servicePath: servicePath,
          build: build,
          envFile: envfile,
          ports: [],
          volumes: [],
          isFollow: false,
        };
        await serviceRunner.docker(dockerConfig, {
          action: "stop",
        });
        break;
      case "local":
        const processId: number = Number(service.processId) || 0;
        const localConfig: LocalConfig = {
          servicePath: servicePath,
          serviceName: serviceName,
          build: build,
          processId: processId,
          isFollow: false,
        };
        await serviceRunner.local(localConfig, {
          action: "stop",
        });
        break;
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
      chalk.green(
        `\n"${serviceName}" is down from ${currentServiceRunner} platform\n`
      )
    );
  }
}
