import { Bolt } from "../typings/bolt";
import { StoreService } from "../typings/store-service";
import getStore from "./get-store";
import { updateStore } from "./update-store";

export const updateAllServicesStatus = async (
  _yamlContent: Bolt,
  json: StoreService,
  option: any
): Promise<void> => {
  const store = await getStore();
  const data = store.get("services") || {};

  // Update the status of all the services to up
  Object.entries(_yamlContent.services).forEach(([serviceName]) => {
    if (!data[serviceName] && option.reset) {
      updateStore("services", serviceName, json);
    }
    if (data[serviceName] && !option.reset) {
      updateStore("services", serviceName, json);
    }
  });
};
