import Local from "../runners/local";
import Docker from "../runners/docker";
import { getAndValidate, getAndValidateService } from "./service-up";

import { exitWithMsg } from "../helpers/exit-with-msg";
import { StoreService } from "../typings/store-service";
import chalk from "chalk";
import getStore from "../helpers/get-store";
import { updateStore } from "../helpers/update-store";

async function checkIfAlreadyDown(_yamlContent: any, serviceName: string) {
  const store = await getStore();
  const data = store.get("services") || [];
  const service = data[serviceName];
  if (service && service.status === "down") {
    await exitWithMsg(`> "${serviceName}" service is already down`);
  }

  return service;
}

export default async (serviceName: string): Promise<void> => {
  const { _yamlPath, _yamlContent } = await getAndValidate(serviceName);

  const { servicePath, _serviceYamlPath, _ymlPath, yamlPath, content } =
    await getAndValidateService(serviceName, _yamlContent);

  const service: StoreService = await checkIfAlreadyDown(
    _yamlContent,
    serviceName
  );

  if (!service) {
    await exitWithMsg(`> "${serviceName}" service is not running`);
  }

  if (service.platform) {
    const { envfile, build } = content.platforms[service.platform];
    switch (service.platform) {
      case "docker":
        await Docker.stop(
          content.container_name,
          servicePath,
          build,
          [],
          envfile
        );
        break;
      case "local":
        const processId: number = Number(service.processId) || 0;
        await Local.stop(processId);
        break;
    }
  }

  const json: StoreService = {
    status: "down",
    platform: undefined,
    port: undefined,
    processId: undefined,
  };

  await updateStore("services", serviceName, json);

  console.log(
    chalk.green(
      `\n"${serviceName}" is down from ${service.platform} platform\n`
    )
  );
};
