import chalk from "chalk";
import Common from "../common";
import { exitWithMsg } from "../helpers/exit-with-msg";
import getStore from "../helpers/get-store";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";
import Docker from "../runners/docker";
import Local from "../runners/local";
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
    const serviceRunner = service.serviceRunner;

    // if (isVM && serviceRunner !== "vm") {
    //   await exitWithMsg(`>> "${serviceName}" is not running on vm`);
    // }

    if (isVM) {
      console.log(chalk.green("coming soon..."));
      process.exit();
      //   await getVmLogs(".", { follow: isFollow });
      return;
    }

    switch (serviceRunner) {
      case "docker":
        const { envfile, build } = content.service_runners[serviceRunner];
        await Docker.logs(
          content.container_name,
          servicePath,
          build,
          [],
          envfile,
          isFollow
        );
        break;
      case "local":
        await Local.logs(serviceName, servicePath, isFollow);
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
