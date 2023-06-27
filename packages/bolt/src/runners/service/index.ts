import { exitWithMsg } from "../../helpers/exit-with-msg";
import { updateStore } from "../../helpers/update-store";
import { DockerConfig, LocalConfig } from "../../typings/project-runner-config";
import { StoreService } from "../../typings/store-service";
import ServiceRunnerDocker from "./docker";
import ServiceRunnerLocal from "./local";

interface Option {
  action: "start" | "stop" | "logs" | "exec";
  serviceName?: string;
}

export default class ServiceRunner {
  public async local(configs: LocalConfig, option: Option) {
    const { servicePath, build, isFollow, processId, serviceName } = configs;

    const serviceRunnerLocal = new ServiceRunnerLocal(servicePath, build);

    const { action } = option;

    switch (action) {
      case "start":
        const PID = await serviceRunnerLocal.start(serviceName);

        // Update store
        const json: StoreService = {
          status: "up",
          serviceRunner: "local",
          port: null,
          processId: PID,
        };
        await updateStore("services", serviceName, json);
        await updateStore("project_runner", "host");
        break;

      case "stop":
        await serviceRunnerLocal.stop(processId);
        break;

      case "logs":
        await serviceRunnerLocal.logs(isFollow, serviceName);
        break;

      default:
        exitWithMsg("Unknown action");
        break;
    }
  }

  public async docker(configs: DockerConfig, option: Option) {
    const {
      containerName,
      servicePath,
      build,
      ports,
      envFile,
      volumes,
      isFollow,
    } = configs;

    const serviceRunnerDocker = new ServiceRunnerDocker(
      containerName,
      servicePath,
      build,
      ports,
      envFile,
      volumes
    );

    const { action, serviceName } = option;

    switch (action) {
      case "start":
        await serviceRunnerDocker.start();

        // Update store
        const json: StoreService = {
          status: "up",
          serviceRunner: "docker",
          port: ports,
          processId: containerName,
        };
        await updateStore("services", serviceName || "", json);
        await updateStore("project_runner", "host");
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
}
