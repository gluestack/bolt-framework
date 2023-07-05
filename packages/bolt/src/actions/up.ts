import { exists } from "fs-extra";
import { join } from "path";

import generateRoutes from "../helpers/generate-routes";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";

import Common from "../common";

import { BOLT } from "../constants/bolt-configs";

import Ingress from "../libraries/ingress";
import { getStoreData } from "../helpers/get-store-data";
import { StoreServices } from "../typings/store-service";
import ServiceUp from "./service-up";
import { serviceRunners } from "../typings/bolt-service";
import chalk from "chalk";

export default class Up {
  public async handle(options: any): Promise<void> {
    let projectRunnerOption: "host" | "vm" | "default" = "default";
    const cache = options.cache || false;
    if (options.host || options.vm) {
      projectRunnerOption = options.host ? "host" : "vm";
    }

    const _yamlContent = await Common.getAndValidateBoltYaml();

    // Validations for metadata and services
    await validateMetadata();
    await validateServices();

    // 1. generates routes
    console.log(`>> Creating Ingress...`);
    const ports = await generateRoutes(_yamlContent);

    const data: StoreServices = await getStoreData("services");

    const serviceUpPromises: any = [];

    const localRunner = ["local", "docker"];
    const vmRunners = ["vmlocal", "vmdocker"];

    Object.entries(_yamlContent.services).forEach(async ([serviceName]) => {
      if (data[serviceName] && data[serviceName].status !== "down") {
        return;
      }

      // Validating and getting content from bolt.service.yaml
      const { content } = await Common.getAndValidateService(
        serviceName,
        _yamlContent
      );

      if (
        projectRunnerOption === "host" &&
        !localRunner.includes(content.default_service_runner)
      ) {
        console.log(
          chalk.red(
            `>> ${serviceName} does not includes host runners. Skipping...`
          )
        );
        return;
      }

      if (
        projectRunnerOption === "vm" &&
        !vmRunners.includes(content.default_service_runner)
      ) {
        console.log(
          chalk.red(
            `>> ${serviceName} does not includes vm runners. Skipping...`
          )
        );
        return;
      }

      const serviceRunner = content.default_service_runner;
      const serviceUp = new ServiceUp();

      serviceUpPromises.push(
        serviceUp.handle(serviceName, {
          serviceRunner,
          cache: cache,
          ports,
        })
      );
    });

    await Promise.all(serviceUpPromises);

    // 2. generates .env
    await Common.generateEnv();

    // 5. starts nginx if the project runner is not vm and nginx config exists in bolt.yaml
    if (_yamlContent.ingress) {
      const nginxConfig = join(process.cwd(), BOLT.NGINX_CONFIG_FILE_NAME);
      if (await exists(nginxConfig)) {
        await Ingress.start(
          BOLT.NGINX_CONTAINER_NAME,
          ports,
          `${nginxConfig}:/etc/nginx/nginx.conf`,
          "nginx:latest"
        );
      }
    }
  }
}
