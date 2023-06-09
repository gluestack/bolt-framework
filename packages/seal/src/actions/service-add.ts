import { join, relative } from "path";

import { exists } from "../helpers/fs-exists";
import { parseYAML } from "../helpers/parse-yaml";
import { exitWithMsg } from "../helpers/exit-with-msg";

import detectProjectType from "../helpers/detect-project";
import chalk from "chalk";
import { copyFolder } from "../helpers/fs-copy";
import { stringifyYAML } from "../helpers/stringify-yaml";
import reWriteFile from "../helpers/reWriteFile";
import { removeSpecialChars, DockerodeHelper } from "@gluestack/helpers";
import { isEmpty } from "lodash";
import { validateSeal } from "../validations/seal";
import { Seal } from "../typings/seal";
import { SealService } from "../typings/seal-service";
import { validateSealService } from "../validations/seal-service";
import getStore from "../helpers/get-store";

export default async (
  serviceName: string,
  directoryPath: string
): Promise<void> => {
  serviceName = removeSpecialChars(serviceName);
  directoryPath = relative(".", directoryPath).replace(/\/+$/, "");

  const _yamlPath = join("seal.yaml");
  if (!(await exists(_yamlPath))) {
    await exitWithMsg(`> "${_yamlPath}" doesn't exists`);
  }

  if (directoryPath === "") {
    directoryPath = ".";
  }

  if (!(await exists(directoryPath))) {
    await exitWithMsg(`> "${directoryPath}" directory doesn't exists`);
  }

  const _serviceYamlPath = join(directoryPath, "seal.service.yaml");
  const _runDockerfilePath = join(directoryPath, "run.Dockerfile");
  const _buildDockerfilePath = join(directoryPath, "build.Dockerfile");
  if (await exists(_serviceYamlPath)) {
    await exitWithMsg(`> "${directoryPath}" is already a service`);
  }

  const _yamlContent: Seal = await validateSeal(await parseYAML(_yamlPath));
  if (_yamlContent) {
    if (!_yamlContent.services || isEmpty(_yamlContent.services)) {
      _yamlContent.services = {};
    }

    if (_yamlContent.services[serviceName]) {
      await exitWithMsg(`> "${serviceName}" service already exists`);
    }
    _yamlContent.services[serviceName] = {
      path: directoryPath,
    };
  }

  console.log(`Creating app in ${join(directoryPath)}`);
  console.log(`Scanning source code`);

  const projectType = await detectProjectType(directoryPath);
  if (projectType === "Unknown") {
    console.log(`Detected an ${chalk.redBright(projectType)} app`);
    console.log(
      chalk.yellow(
        `Manually edit "seal.service.yaml", "run.Dockerfile", "build.Dockerfile"`
      )
    );
  } else {
    console.log(`Detected ${chalk.green(projectType)} app`);
  }

  const folderPath = join(__dirname, "..", "templates", projectType);

  if (!(await exists(folderPath))) {
    await exitWithMsg(
      `"${chalk.redBright(projectType)}" service is not supported`
    );
  }

  await copyFolder(folderPath, directoryPath);
  let replaceArr = [
    {
      source: "SERVICE_NAME",
      replace: serviceName,
    },
    {
      source: "DIRECTORY_PATH",
      replace: directoryPath,
    },
    {
      source: "FOLDER_NAME",
      replace: directoryPath.split("/")[directoryPath.split("/").length - 1],
    },
  ];
  const content: SealService = await validateSealService(
    await parseYAML(_serviceYamlPath)
  );

  if (content?.platforms?.docker?.ports?.length) {
    for (const port of content?.platforms?.docker?.ports) {
      const replacePortBy = port.split(":")[0];
      const findPortBy = parseInt(port.split(":")[1]);
      let portFound = findPortBy;
      try {
        portFound = await DockerodeHelper.getPort(findPortBy, [], 100);
      } catch (e) {
        //
      }
      replaceArr.push({
        source: replacePortBy,
        replace: portFound.toString(),
      });
    }
  }

  await reWriteFile(_serviceYamlPath, replaceArr);
  await reWriteFile(_runDockerfilePath, replaceArr);
  await reWriteFile(_buildDockerfilePath, replaceArr);

  await stringifyYAML(_yamlContent, _yamlPath);

  const store = await getStore();
  let data = store.get("services") || [];

  if (!data[serviceName]) {
    data = {
      ...data,
      [serviceName]: {
        status: "down",
        platform: null,
        port: null,
        processId: null,
      },
    };

    store.set("services", data);
  }

  console.log(
    `Installed ${chalk.green(serviceName)} service in ${chalk.green(
      join(directoryPath)
    )}`
  );

  store.save();
};
