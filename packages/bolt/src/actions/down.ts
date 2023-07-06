import chalk from "chalk";
import { join } from "path";

import { exitWithMsg } from "../helpers/exit-with-msg";
import { exists } from "../helpers/fs-exists";
import getStore from "../helpers/get-store";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";

import Common from "../common";

import Ingress from "../libraries/ingress";

import { BOLT } from "../constants/bolt-configs";

import { ProjectRunners, StoreServices } from "../typings/store-service";
import { getStoreData } from "../helpers/get-store-data";
import ServiceDown from "./service-down";
import ServiceRunnerVM from "../runners/service/vm";
import { updateStore } from "../helpers/update-store";

export default class Down {
  public async handle() {
    const _yamlContent = await Common.getAndValidateBoltYaml();

    // Validations for metadata and services
    await validateMetadata();
    await validateServices();

    console.log(`>> Stopping ${_yamlContent.project_name}...`);

    const data: StoreServices = await getStoreData("services");

    const serviceDownPromises: any = [];

    Object.entries(_yamlContent.services).forEach(async ([serviceName]) => {
      if (data[serviceName] && data[serviceName].status === "down") {
        return;
      }

      const serviceDown = new ServiceDown();
      serviceDownPromises.push(serviceDown.handle(serviceName));
    });

    await Promise.all(serviceDownPromises);

    const vmStatus = await getStoreData("vm");

    if (vmStatus === "up") {
      await ServiceRunnerVM.down();
      await updateStore("vm", "down");
    }

    // 3. stops the nginx container if it is running
    if (_yamlContent.ingress) {
      const nginxConfig = join(process.cwd(), BOLT.NGINX_CONFIG_FILE_NAME);
      if (await exists(nginxConfig)) {
        await Ingress.stop(BOLT.NGINX_CONTAINER_NAME);
      }
    }

    console.log(chalk.green(`>> ${_yamlContent.project_name} is down.\n`));
  }
}
