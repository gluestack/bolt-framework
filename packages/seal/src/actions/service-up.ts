import { join, relative } from "path";
import { readdir } from "fs/promises";

import { exists } from "../helpers/fs-exists";
import { parseYAML } from "../helpers/parse-yaml";
import { exitWithMsg } from "../helpers/exit-with-msg";

import { SealService } from "../typings/seal-service";
import { RunServiceOptions } from "../typings/run-service-options";

import { validateSealService } from "../validations/seal-service";

import Local from "../runners/local";
import Docker from "../runners/docker";
import { find, isEmpty } from "lodash";
import { validateSeal } from "../validations/seal";
import { Seal } from "../typings/seal";
import { closestMatch } from "closest-match";
import chalk from "chalk";
import * as os from "os";
import { readfile } from "../helpers/fs-readfile-json";
import { execute } from "../helpers/execute";
import getStore from "../helpers/get-store";
import { updateStore } from "../helpers/update-store";
import { getDockerStatus } from "../helpers/docker-info";

export async function getAndValidate(serviceName: string) {
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

  if (!_yamlContent.services[serviceName]) {
    const closestWord = closestMatch(
      serviceName,
      Object.keys(_yamlContent.services)
    );
    console.log(
      chalk.bgRed(`\nUnknown service: "${serviceName}".`),
      chalk.cyan(`Did you mean "${closestWord}"?`)
    );
    await exitWithMsg("");
  }

  return { _yamlPath, _yamlContent };
}

export async function getAndValidateService(
  serviceName: string,
  _yamlContent: any
) {
  // if service doesn't exists, exit
  const servicePath: string = join(
    process.cwd(),
    _yamlContent.services[serviceName].path
  );

  if (!(await exists(servicePath))) {
    await exitWithMsg(`> service ${relative(".", servicePath)} doesn't exists`);
  }

  // check if given service has a seal.service.yaml file
  const _serviceYamlPath: string | boolean = await exists(
    join(servicePath, "seal.service.yaml")
  );
  const _ymlPath: string | boolean = await exists(
    join(servicePath, "seal.service.yaml")
  );

  // if yaml doesn't exists, exit
  if (!_serviceYamlPath && !_ymlPath) {
    await exitWithMsg(
      `> service ${relative(
        ".",
        join(servicePath, "seal.service.yaml")
      )} file doesn't exists`
    );
  }

  const yamlPath: string = (
    _serviceYamlPath ? _serviceYamlPath : _ymlPath
  ) as string;
  const content: SealService = await validateSealService(
    await parseYAML(yamlPath)
  );

  return { servicePath, _serviceYamlPath, _ymlPath, yamlPath, content };
}

async function checkIfAnotherProjectIsUp(_yamlContent: any) {
  const _sealFolderPath = join(os.homedir(), ".seal");
  const files: string[] = await readdir(_sealFolderPath);
  for await (const file of files) {
    if (!file.endsWith(".json") || file === "projects.json") {
      continue;
    }

    if (file !== `${_yamlContent.project_id}.json`) {
      const data: any[] = (await readfile(join(_sealFolderPath, file))) || [];
      const serviceUp = find(data, { status: "up" });
      if (serviceUp) {
        await exitWithMsg(
          `> seal project with ID: ${file.split(".")[0]} is already up`
        );
      }
    }
  }
}

async function checkIfAlreadyUp(_yamlContent: any, serviceName: string) {
  const store = await getStore();
  const data = store.get("services") || [];
  const service = data[serviceName];
  if (service && service.status === "up") {
    await exitWithMsg(
      `> "${serviceName}" service is already up on ${service.platform}`
    );
  }
}

async function generateEnv() {
  const args: string[] = ["env:generate"];

  console.log(chalk.gray("$ seal", args.join(" ")));

  await execute("seal", args, {
    cwd: process.cwd(),
    shell: true,
  });
}

export default async (
  serviceName: string,
  options: RunServiceOptions
): Promise<void> => {
  const { platform } = options;

  if (platform === "docker") {
    const isDockerRunning = await getDockerStatus();
    if (!isDockerRunning) {
      console.log(chalk.red("Unable to connect with docker!"));
      process.exit();
    }
  }

  const { _yamlPath, _yamlContent } = await getAndValidate(serviceName);

  await checkIfAlreadyUp(_yamlContent, serviceName);

  const { servicePath, _serviceYamlPath, _ymlPath, yamlPath, content } =
    await getAndValidateService(serviceName, _yamlContent);

  // if service doesn't contain given platform, exit
  if (!content.platforms[platform]) {
    await exitWithMsg(
      `> service ${serviceName}: "${relative(
        ".",
        join(servicePath, "seal.service.yaml")
      )}" doesn't support ${platform} platform`
    );
  }

  const { envfile, build, ports, volumes, context } =
    content.platforms[platform];

  // generates .env
  await generateEnv();

  let PID: any = null;

  switch (platform) {
    case "docker":
      await Docker.start(
        content.container_name,
        servicePath,
        build,
        ports || [],
        envfile,
        volumes
      );
      PID = content.container_name;
      break;
    case "local":
      PID = await Local.start(context || servicePath, build);
      break;
  }

  const json = {
    status: "up",
    platform: platform,
    port: ports,
    processId: PID,
  };

  await updateStore("services", serviceName, json);

  console.log(
    chalk.green(`\n"${serviceName}" service is up on ${platform} platform\n`)
  );
};
