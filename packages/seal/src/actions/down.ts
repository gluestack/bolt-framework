import { Seal } from "../typings/seal";
import DockerCompose from "../runners/docker-compose";
import { getAndValidateSealYaml } from "./up";
import chalk from "chalk";
import sealServiceDown from "./service-down";
import getStore from "../helpers/get-store";

// Stops the seal.compose
async function stopDockerCompose(_yamlContent: Seal): Promise<void> {
  const filepath: string = process.cwd();
  const projectName: string = _yamlContent.project_name;

  // starting seal.compose
  const dockerCompose = new DockerCompose();
  await dockerCompose.stop(projectName, filepath);
}

export default async (): Promise<void> => {
  const _yamlContent = await getAndValidateSealYaml();

  console.log(`> Stopping ${_yamlContent.project_name}...`);

  const store = await getStore();
  const data = await store.get("services");
  const servicePromises: any[] = [];

  // All the services whose status is down are appended to servicePromises array and later gets resolved
  Object.entries(_yamlContent.services).forEach(([serviceName]) => {
    if (data[serviceName] && data[serviceName].status === "up") {
      servicePromises.push(sealServiceDown(serviceName));
    }
  });
  await Promise.all(servicePromises);

  console.log(chalk.green(`\n${_yamlContent.project_name} is down.\n`));
};
