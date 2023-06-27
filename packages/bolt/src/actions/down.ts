import chalk from "chalk";
import { join } from "path";

import { exitWithMsg } from "../helpers/exit-with-msg";
import { exists } from "../helpers/fs-exists";
import getStore from "../helpers/get-store";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";

import Common from "../common";

import ServiceRunnerDocker from "../runners/service/docker";
import ProjectRunner from "../runners/project";
import { BOLT } from "../constants/bolt-configs";
import { ProjectRunners } from "../typings/store-service";

export default class Down {
  public async handle() {
    const _yamlContent = await Common.getAndValidateBoltYaml();

    // Validations for metadata and services
    await validateMetadata();
    await validateServices();

    console.log(`>> Stopping ${_yamlContent.project_name}...`);

    const store = await getStore();
    const projectRunnerEnv: ProjectRunners = await store.get("project_runner");

    if (!projectRunnerEnv) {
      exitWithMsg(`>> Project runner not found. Please run the project first.`);
    }

    // 1. creating a project runner instance
    const projectRunner = new ProjectRunner(_yamlContent);

    // 2. stops the services on particular project runner platform
    switch (projectRunnerEnv) {
      case "none":
        exitWithMsg(
          `>> ${_yamlContent.project_name} is not running. Please run "bolt up" first.`
        );
        break;
      case "host":
        await projectRunner.host({ action: "down" });
        break;
      case "vm":
        await projectRunner.vm(false, { action: "down" });
        break;
      default:
        exitWithMsg(
          `>> Unknown server environment for ${_yamlContent.project_name}`
        );
        break;
    }

    // 3. stops the nginx container if it is running
    if (projectRunnerEnv !== "vm") {
      if (await exists(join(process.cwd(), BOLT.NGINX_CONFIG_FILE_NAME))) {
        await ServiceRunnerDocker.stopOnly(BOLT.NGINX_CONTAINER_NAME);
      }
    }

    console.log(chalk.green(`>> ${_yamlContent.project_name} is down.\n`));
  }
}
