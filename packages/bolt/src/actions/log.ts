import BoltVm from "@gluestack/boltvm";
import chalk from "chalk";
import Common from "../common";
import { exitWithMsg } from "../helpers/exit-with-msg";
import getStore from "../helpers/get-store";
import { getStoreData } from "../helpers/get-store-data";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";
import ServiceRunner from "../runners/service";
import {
  DockerConfig,
  LocalConfig,
  VMConfig,
} from "../typings/service-runner-config";
import { StoreService } from "../typings/store-service";

export default class Log {
  public async checkIfServiceIsUp(_yamlContent: any, serviceName: string) {
    const store = await getStore();
    if (!_yamlContent.services[serviceName]) {
      await exitWithMsg(`>> "${serviceName}" service is not present.`);
    }
    const data = store.get("services") || [];
    const service = data[serviceName];
    if (service && service.status === "down") {
      await exitWithMsg(
        `>> "${serviceName}" service is down. Please start the service to see the logs`
      );
    }
    return service;
  }

  public async handle(serviceName: string, option: any): Promise<void> {
    const isFollow = option.follow || false;
    const isVM = option.vm || false;
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

    const service: StoreService = await this.checkIfServiceIsUp(
      _yamlContent,
      serviceName
    );
    const currentServiceRunner = service.serviceRunner;

    const vmStatus = await getStoreData("vm");
    if (isVM && vmStatus !== "up") {
      await exitWithMsg(`>> VM is not running!`);
    }

    if (isVM) {
      const boltVm = new BoltVm(process.cwd());
      // Validating boltVm Dependencies
      await boltVm.doctor();

      await boltVm.log(isFollow);
      return;
    }

    const serviceRunner = new ServiceRunner();

    switch (currentServiceRunner) {
      case "docker":
        const { envfile, build } =
          content.service_runners[currentServiceRunner];
        const dockerConfig: DockerConfig = {
          containerName: content.container_name,
          servicePath: servicePath,
          build: build,
          envFile: envfile,
          ports: [],
          volumes: [],
        };

        await serviceRunner.docker(dockerConfig, {
          action: "logs",
          serviceName: serviceName,
          isFollow: isFollow,
        });
        break;

      case "local":
        const localConfig: LocalConfig = {
          servicePath: servicePath,
          build: content.service_runners[currentServiceRunner].build,
          processId: 0,
          ports: [],
        };

        await serviceRunner.local(localConfig, {
          action: "logs",
          serviceName: serviceName,
          isFollow: isFollow,
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
          action: "logs",
          serviceName: serviceName,
          isFollow: isFollow,
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
          action: "logs",
          serviceName: serviceName,
          isFollow: isFollow,
        });
        break;
      default:
        await exitWithMsg(">> Platform not supported");
    }
  }
}
