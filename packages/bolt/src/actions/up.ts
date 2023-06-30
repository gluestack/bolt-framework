import { exists } from "fs-extra";
import { join } from "path";

import { serviceRunners } from "../constants/platforms";

import { exitWithMsg } from "../helpers/exit-with-msg";
import generateRoutes from "../helpers/generate-routes";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";

import Common from "../common";

import ServiceRunnerDocker from "../runners/service/docker";
import ProjectRunner from "../runners/project";
import { BOLT } from "../constants/bolt-configs";
import { stringifyYAML } from "../helpers/stringify-yaml";

export default class Up {
  public async handle(options: any): Promise<void> {
    let projectRunnerOption: "host" | "vm" | undefined;
    if (options.host || options.vm) {
      projectRunnerOption = options.host ? "host" : "vm";
    }

    const _yamlContent = await Common.getAndValidateBoltYaml();

    if (!projectRunnerOption) {
      projectRunnerOption = _yamlContent.default_project_runner;
    } else {
      _yamlContent.default_project_runner = projectRunnerOption;
      await stringifyYAML(
        _yamlContent,
        join(process.cwd(), BOLT.YAML_FILE_NAME)
      );
    }

    const defaultServiceRunner = _yamlContent.default_service_runner;

    if (!defaultServiceRunner) {
      exitWithMsg("Please Specify a default runner for the app.");
    }

    if (!serviceRunners.includes(defaultServiceRunner)) {
      exitWithMsg(
        `Invalid runner "${_yamlContent.default_service_runner}" specified in bolt.yaml`
      );
    }

    // Validations for metadata and services
    await validateMetadata();
    await validateServices();

    // 1. generates routes
    console.log(`>> Creating Ingress ${_yamlContent.project_name}...`);
    const ports = await generateRoutes(_yamlContent);

    // 2. generates .env
    await Common.generateEnv();

    // 3. creating a project runner instance
    const projectRunner = new ProjectRunner(_yamlContent);

    // 4. starts the services on specified project runner
    switch (projectRunnerOption) {
      case "host":
        await projectRunner.host({ action: "up" });
        break;
      case "vm":
        const cache = options.cache ? true : false;
        await projectRunner.vm({ action: "up" }, cache);
        break;
      default:
        exitWithMsg(
          `Invalid runner "${projectRunnerOption}" specified in ${BOLT.YAML_FILE_NAME}`
        );
        break;
    }

    // 5. starts nginx if the project runner is not vm and nginx config exists in bolt.yaml
    if (projectRunnerOption !== "vm" && _yamlContent.ingress) {
      const nginxConfig = join(process.cwd(), BOLT.NGINX_CONFIG_FILE_NAME);
      if (await exists(nginxConfig)) {
        await ServiceRunnerDocker.startOnly(
          BOLT.NGINX_CONTAINER_NAME,
          ports,
          `${nginxConfig}:/etc/nginx/nginx.conf`,
          "nginx:latest"
        );
      }
    }
  }
}
