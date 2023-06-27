import chalk from "chalk";
import Common from "../common";
import { exitWithMsg } from "../helpers/exit-with-msg";
import getStore from "../helpers/get-store";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";
import ServiceRunner from "../runners/service";
import { DockerConfig, LocalConfig } from "../typings/project-runner-config";
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

    // if (isVM && serviceRunner !== "vm") {
    //   await exitWithMsg(`>> "${serviceName}" is not running on vm`);
    // }

    if (isVM) {
      console.log(chalk.green("coming soon..."));
      process.exit();
      //   await getVmLogs(".", { follow: isFollow });
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
          isFollow: isFollow,
        };
        await serviceRunner.docker(dockerConfig, { action: "logs" });
        break;
      case "local":
        const localConfig: LocalConfig = {
          servicePath: servicePath,
          serviceName: serviceName,
          build: content.service_runners[currentServiceRunner].build,
          isFollow: isFollow,
          processId: 0,
        };
        serviceRunner.local(localConfig, { action: "logs" });
        break;
      // case "vm":
      //   const vmConfig = _yamlContent.server.vm;
      //   await validateVmConfig(vmConfig);
      //   const logFolderPath = join(`.logs`, `${vmConfig.name}`);
      //   await getLogs(serviceName, servicePath, isFollow, logFolderPath);
      // break;
      default:
        await exitWithMsg(">> Platform not supported");
    }
  }
}
