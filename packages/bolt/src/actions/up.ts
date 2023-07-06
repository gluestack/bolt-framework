import { exists } from "fs-extra";
import { join } from "path";

import generateRoutes from "../helpers/generate-routes";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";

import Common from "../common";

import { BOLT } from "../constants/bolt-configs";

import Ingress from "../libraries/ingress";
import { getStoreData } from "../helpers/get-store-data";
import { ServiceRunners, StoreServices } from "../typings/store-service";
import ServiceUp from "./service-up";
import { serviceRunners } from "../typings/bolt-service";
import chalk from "chalk";
import BoltVm from "@gluestack/boltvm";
import { updateStore } from "../helpers/update-store";
import { supportedServiceRunners } from "../constants/platforms";

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

    const localRunners = ["local", "docker"];
    const vmRunners = ["vmlocal", "vmdocker"];

    let isVmPresent = false;
    for await (const [serviceName, service] of Object.entries(
      _yamlContent.services
    )) {
      if (data[serviceName] && data[serviceName].status !== "down") {
        continue;
      }

      // Validating and getting content from bolt.service.yaml
      const { content } = await Common.getAndValidateService(
        serviceName,
        _yamlContent
      );

      if (
        content.default_service_runner === "vmlocal" ||
        content.default_service_runner === "vmdocker"
      ) {
        isVmPresent = true;
        break;
      }
    }

    if (isVmPresent) {
      const cache = options.cache || false;
      const boltVm = new BoltVm(process.cwd());
      await boltVm.create(cache);
      await updateStore("vm", "up");
    }

    Object.entries(_yamlContent.services).forEach(async ([serviceName]) => {
      if (data[serviceName] && data[serviceName].status !== "down") {
        return;
      }

      // Validating and getting content from bolt.service.yaml
      const { content } = await Common.getAndValidateService(
        serviceName,
        _yamlContent
      );

      const { default_service_runner, supported_service_runners } = content;
      let prepared_service_runner: ServiceRunners = default_service_runner;

      if (projectRunnerOption === "host") {
        if (
          !supported_service_runners.includes("local") &&
          !supported_service_runners.includes("docker")
        ) {
          console.log(
            chalk.red(
              `>> ${serviceName} does not includes host service runners. Skipping...`
            )
          );
          return;
        } else {
          const availableRunners = supported_service_runners.filter(
            (e) => !vmRunners.includes(e)
          );
          prepared_service_runner = availableRunners[0];
        }
      }

      if (projectRunnerOption === "vm") {
        if (
          !supported_service_runners.includes("vmlocal") &&
          !supported_service_runners.includes("vmdocker")
        ) {
          console.log(
            chalk.red(
              `>> ${serviceName} does not includes vm service runners. Skipping...`
            )
          );
          return;
        } else {
          const availableRunners = supported_service_runners.filter(
            (e) => !localRunners.includes(e)
          );
          prepared_service_runner = availableRunners[0];
        }
      }

      const serviceUp = new ServiceUp();

      serviceUpPromises.push(
        serviceUp.handle(serviceName, {
          serviceRunner: prepared_service_runner,
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
