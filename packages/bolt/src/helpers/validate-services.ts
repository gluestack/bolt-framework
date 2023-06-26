import chalk from "chalk";

import Common from "../common";
import { StoreService, StoreServices } from "../typings/store-service";
import { exitWithMsg } from "./exit-with-msg";
import getStore from "./get-store";
import { updateAllServicesStatus } from "./update-all-services-status";
import { updateStore } from "./update-store";

export const validateServices = async (option?: any) => {
  try {
    let _yamlContent = await Common.getAndValidateBoltYaml();

    const store = await getStore();
    const data: StoreServices = store.get("services");
    const projectRunner = await store.get("project_runner");

    if (!projectRunner) {
      updateStore("project_runner", "none");
    }

    const json: StoreService = {
      status: "down",
      serviceRunner: null,
      port: null,
      processId: null,
    };

    if (!data) {
      console.log(`Services not found in metadata! Updating...`);
      await updateAllServicesStatus(_yamlContent, json, { reset: true });
      console.log(`Services updated!`);
      return;
    }

    Object.entries(_yamlContent.services).forEach(([serviceName]) => {
      if (!data[serviceName]) {
        console.log(
          `${chalk.green(
            serviceName
          )} service not found in metadata! Updating...`
        );
        updateStore("services", serviceName, json);
        console.log(`Updated ${chalk.green(serviceName)} service!`);
      }
    });
  } catch (error: any) {
    exitWithMsg(`Error while validating metatdata, ${error}`);
  }
};
