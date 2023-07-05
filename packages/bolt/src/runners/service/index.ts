import { exitWithMsg } from "../../helpers/exit-with-msg";
import {
  DockerConfig,
  LocalConfig,
  VMConfig,
} from "../../typings/service-runner-config";
import ServiceRunnerDocker from "./docker";
import ServiceRunnerLocal from "./local";
import ServiceRunnerVM from "./vm";

interface Option {
  action: "start" | "stop" | "logs";
  serviceName: string;
  isFollow?: boolean;
}

export default class ServiceRunner {
  public async local(configs: LocalConfig, option: Option) {
    const { servicePath, build, processId } = configs;
    const { action, serviceName } = option;

    const isFollow = option.isFollow || false;

    const serviceRunnerLocal = new ServiceRunnerLocal(
      serviceName,
      servicePath,
      build
    );

    switch (action) {
      case "start":
        await serviceRunnerLocal.start();
        break;

      case "stop":
        await serviceRunnerLocal.stop(processId);
        break;

      case "logs":
        await serviceRunnerLocal.logs(isFollow);
        break;

      default:
        exitWithMsg("Unknown action");
        break;
    }
  }

  public async docker(configs: DockerConfig, option: Option) {
    const { containerName, servicePath, build, ports, envFile, volumes } =
      configs;
    const { action, serviceName } = option;

    const isFollow = option.isFollow || false;

    const serviceRunnerDocker = new ServiceRunnerDocker(
      serviceName,
      containerName,
      servicePath,
      build,
      ports,
      envFile,
      volumes
    );

    switch (action) {
      case "start":
        await serviceRunnerDocker.start();
        break;

      case "stop":
        await serviceRunnerDocker.stop();
        break;

      case "logs":
        await serviceRunnerDocker.logs(isFollow);
        break;

      default:
        exitWithMsg(`Unknown action: ${action}`);
        break;
    }
  }

  public async vm(configs: VMConfig, option: Option) {
    const { serviceContent, cache, runnerType } = configs;
    const { action, serviceName } = option;

    const isFollow = option.isFollow || false;

    const serviceRunnerVm = new ServiceRunnerVM(
      serviceContent,
      serviceName,
      cache,
      runnerType
    );

    switch (action) {
      case "start":
        await serviceRunnerVm.start();
        break;

      case "stop":
        await serviceRunnerVm.stop();
        break;

      case "logs":
        await serviceRunnerVm.logs(isFollow);
        break;

      default:
        exitWithMsg(`Unknown action: ${action}`);
        break;
    }
  }
}
