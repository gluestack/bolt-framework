import chalk from "chalk";

import { exitWithMsg } from "../helpers/exit-with-msg";
import getStore from "../helpers/get-store";
import { updateStore } from "../helpers/update-store";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";

import Common from "../common";

import { StoreService, StoreServices } from "../typings/store-service";
import { Bolt } from "../typings/bolt";
import ServiceRunner from "../runners/service";
import {
  DockerConfig,
  LocalConfig,
  VMConfig,
} from "../typings/service-runner-config";
import ServiceRunnerVM from "../runners/service/vm";
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

    const serviceRunner = new ServiceRunner();
    switch (currentServiceRunner) {
      case "docker":
        const { envfile, build } = content.service_runners.docker;
        const dockerConfig: DockerConfig = {
          containerName: content.container_name,
          servicePath: servicePath,
          build: build,
          envFile: envfile,
          ports: [],
          volumes: [],
        };

        await serviceRunner.docker(dockerConfig, {
          action: "stop",
          serviceName: serviceName,
        });
        break;

      case "local":
        const processId: number = Number(service.processId) || 0;
        const { build: localBuild } = content.service_runners.local;
        const localConfig: LocalConfig = {
          servicePath: servicePath,
          build: localBuild,
          processId: processId,
        };
        await serviceRunner.local(localConfig, {
          action: "stop",
          serviceName: serviceName,
        });
        break;

      case "vmlocal":
        const vmConfig: VMConfig = {
          serviceContent: content,
          serviceName: serviceName,
          cache: false,
          runnerType: "vmlocal",
        };
        await serviceRunner.vm(vmConfig, {
          action: "stop",
          serviceName: serviceName,
        });
        break;

      case "vmdocker":
        const vmDockerConfig: VMConfig = {
          serviceContent: content,
          serviceName: serviceName,
          cache: false,
          runnerType: "vmdocker",
        };

        await serviceRunner.vm(vmDockerConfig, {
          action: "stop",
          serviceName: serviceName,
        });
        break;
    }

    console.log(
      chalk.green(
        `\n"${serviceName}" is down from ${currentServiceRunner} platform\n`
      )
    );
  }
}
