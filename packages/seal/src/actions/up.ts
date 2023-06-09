import { join } from "path";

import { exists } from "../helpers/fs-exists";
import { parseYAML } from "../helpers/parse-yaml";
import { exitWithMsg } from "../helpers/exit-with-msg";

import { isEmpty } from "lodash";
import { validateSeal } from "../validations/seal";
import { Seal } from "../typings/seal";
import DockerCompose from "../runners/docker-compose";
import sealServiceUp, { getAndValidateService } from "./service-up";
import chalk from "chalk";
import generateRoutes from "../helpers/generate-routes";
import { execute } from "../helpers/execute";
import getStore from "../helpers/get-store";

export async function getAndValidateSealYaml() {
  const _yamlPath = join("seal.yaml");
  if (!(await exists(_yamlPath))) {
    await exitWithMsg(`> "${_yamlPath}" doesn't exists`);
  }

  const _yamlContent: Seal = await validateSeal(await parseYAML(_yamlPath));
  if (
    !_yamlContent ||
    !_yamlContent.services ||
    isEmpty(_yamlContent.services)
  ) {
    await exitWithMsg(`> "seal.yaml" services does not exists`);
  }

  return _yamlContent;
}

// Creates the seal.compose file
async function createDockerCompose(
  _yamlContent: Seal,
  ports?: string[]
): Promise<void> {
  const dockerCompose = new DockerCompose();

  // Gather all the availables services
  for await (const [serviceName, service] of Object.entries(
    _yamlContent.services
  )) {
    const { servicePath, _serviceYamlPath, _ymlPath, yamlPath, content } =
      await getAndValidateService(serviceName, _yamlContent);
    await dockerCompose.addService(
      _yamlContent.project_name,
      serviceName,
      servicePath,
      content.platforms[_yamlContent.default_runner]
    );
  }

  await dockerCompose.addNginx(ports);

  await dockerCompose.generate();
}

// Starts the seal.compose
async function startDockerCompose(_yamlContent: Seal): Promise<void> {
  // constructing the path to engine's router
  const filepath: string = process.cwd();

  const projectName: string = _yamlContent.project_name;

  // starting docker compose
  const dockerCompose = new DockerCompose();
  await dockerCompose.start(projectName, filepath);
}

async function generateEnv() {
  const args: string[] = ["env:generate"];

  console.log(chalk.gray("$ seal", args.join(" ")));

  await execute("seal", args, {
    cwd: process.cwd(),
    shell: true,
  });
}

// Starts the services when the default runner is local
async function startServiceOnLocal(serviceName: string, _yamlContent: Seal) {
  // Getting the service details and validating it
  const { servicePath, _serviceYamlPath, _ymlPath, yamlPath, content } =
    await getAndValidateService(serviceName, _yamlContent);
  if (content.platforms["local"]) {
    await sealServiceUp(serviceName, { platform: "local", ports: [] });
  } else {
    await sealServiceUp(serviceName, { platform: "docker", ports: [] });
  }
}

async function startServiceOnDocker(serviceName: string, _yamlContent: Seal) {
  // Getting the service details and validating it
  const { servicePath, _serviceYamlPath, _ymlPath, yamlPath, content } =
    await getAndValidateService(serviceName, _yamlContent);

  if (!content.platforms["docker"]) {
    await sealServiceUp(serviceName, { platform: "local", ports: [] });
  } else {
    await sealServiceUp(serviceName, { platform: "docker", ports: [] });
  }
}

export default async (): Promise<void> => {
  const _yamlContent = await getAndValidateSealYaml();

  // 1. generates routes
  console.log(`> Creating Ingress ${_yamlContent.project_name}...`);
  const ports = await generateRoutes(_yamlContent);

  // 2. generates .env
  await generateEnv();

  const store = await getStore();
  const data = store.get("services") || [];

  if (!_yamlContent.default_runner) {
    console.log(chalk.red("Please Specify a default runner for the app."));
    process.exit();
  }

  const runner = _yamlContent.default_runner;
  const servicePromises: any[] = [];

  switch (runner) {
    case "docker":
      // All the services whose status is down are appended to servicePromises array and later gets resolved
      Object.entries(_yamlContent.services).forEach(([serviceName]) => {
        if (data[serviceName] && data[serviceName].status === "down") {
          servicePromises.push(startServiceOnDocker(serviceName, _yamlContent));
        }
      });
      await Promise.all(servicePromises);

      process.exit(0);
      break;
    case "local":
      // All the services whose status is down are appended to servicePromises array and later gets resolved
      Object.entries(_yamlContent.services).forEach(([serviceName]) => {
        if (data[serviceName] && data[serviceName].status === "down") {
          servicePromises.push(startServiceOnLocal(serviceName, _yamlContent));
        }
      });
      await Promise.all(servicePromises);

      process.exit(0);
      break;
    default: {
      exitWithMsg(`> "${_yamlContent.default_runner}" runner not supported.`);
    }
  }
};
