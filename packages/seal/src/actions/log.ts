import { exitWithMsg } from "../helpers/exit-with-msg";
import getStore from "../helpers/get-store";
import Docker from "../runners/docker";
import Local from "../runners/local";
import { StoreService } from "../typings/store-service";
import { getAndValidate, getAndValidateService } from "./service-up";

async function checkIfServiceIsUp(_yamlContent: any, serviceName: string) {
  const store = await getStore();
  if (!_yamlContent.services[serviceName]) {
    await exitWithMsg(`> "${serviceName}" service is not present.`);
  }
  const data = store.get("services") || [];
  const service = data[serviceName];
  if (service && service.status === "down") {
    await exitWithMsg(
      `> "${serviceName}" service is down. Please start the service to see the logs`
    );
  }
  return service;
}

export default async (serviceName: string, option: any): Promise<void> => {
  const isFollow = option.follow || false;
  const { _yamlPath, _yamlContent } = await getAndValidate(serviceName);

  const { servicePath, _serviceYamlPath, _ymlPath, yamlPath, content } =
    await getAndValidateService(serviceName, _yamlContent);

  const service: StoreService = await checkIfServiceIsUp(
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
        await Docker.logs(
          content.container_name,
          servicePath,
          build,
          [],
          envfile,
          isFollow
        );
        break;
      case "local":
        await Local.logs(serviceName, servicePath, isFollow);
        break;
    }
  }
};
