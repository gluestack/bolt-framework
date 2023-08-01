import { DockerodeHelper, removeSpecialChars } from "@gluestack/helpers";
import chalk from "chalk";
import { isEmpty } from "lodash";
import { join, relative } from "path";
import { BOLT } from "../constants/bolt-configs";
import detectProjectType from "../helpers/detect-project";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { copyFolder } from "../helpers/fs-copy";
import { exists } from "../helpers/fs-exists";
import { parseYAML } from "../helpers/parse-yaml";
import reWriteFile from "../helpers/reWriteFile";
import { stringifyYAML } from "../helpers/stringify-yaml";
import { updateStore } from "../helpers/update-store";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";
import { StoreService } from "../typings/store-service";
import { validateBolt } from "../validations/bolt";
import { validateBoltService } from "../validations/bolt-service";

export default class ServiceAdd {
  public async handle(
    serviceName: string,
    directoryPath: string
  ): Promise<void> {
    serviceName = removeSpecialChars(serviceName);
    directoryPath = relative(".", directoryPath).replace(/\/+$/, "");

    const _yamlPath = join(BOLT.YAML_FILE_NAME);
    if (!(await exists(_yamlPath))) {
      await exitWithMsg(`>> "${_yamlPath}" doesn't exists`);
    }

    if (directoryPath === "") {
      directoryPath = ".";
    }

    if (!(await exists(directoryPath))) {
      await exitWithMsg(`>> "${directoryPath}" directory doesn't exists`);
    }

    const _serviceYamlPath = join(directoryPath, BOLT.SERVICE_YAML_FILE_NAME);
    const _runDockerfilePath = join(directoryPath, "run.Dockerfile");
    const _buildDockerfilePath = join(directoryPath, "build.Dockerfile");
    if (await exists(_serviceYamlPath)) {
      await exitWithMsg(`>> "${directoryPath}" is already a service`);
    }

    const _yamlContent = await validateBolt(await parseYAML(_yamlPath));

    if (_yamlContent) {
      if (!_yamlContent.services || isEmpty(_yamlContent.services)) {
        _yamlContent.services = {};
      }

      if (_yamlContent.services[serviceName]) {
        await exitWithMsg(`>> "${serviceName}" service already exists`);
      }
      _yamlContent.services[serviceName] = {
        path: directoryPath,
      };
    }

    console.log(`Creating app in ${join(directoryPath)}`);
    console.log(`Scanning source code`);

    const projectType = detectProjectType(directoryPath);
    if (projectType === "Unknown") {
      console.log(`Detected an ${chalk.redBright(projectType)} app`);
      console.log(
        chalk.yellow(
          `Manually edit "bolt.service.yaml", "run.Dockerfile", "build.Dockerfile"`
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

    const content = await validateBoltService(
      await parseYAML(_serviceYamlPath)
    );

    const service_runners = content?.service_runners;
    if (service_runners?.docker?.ports?.length) {
      // for (const port of service_runners?.docker?.ports) {
      // const replacePortBy = port.split(":")[0];
      // const findPortBy = parseInt(port.split(":")[1]);
      // let portFound = findPortBy;
      // try {
      //   portFound = await DockerodeHelper.getPort(findPortBy, [], 100);
      // } catch (e) {
      //   //
      // }
      // replaceArr.push({
      //   source: replacePortBy,
      //   replace: portFound.toString(),
      // });
      // }
    }

    await reWriteFile(_serviceYamlPath, replaceArr);
    await reWriteFile(_runDockerfilePath, replaceArr);
    await reWriteFile(_buildDockerfilePath, replaceArr);

    await stringifyYAML(_yamlContent, _yamlPath);

    const json: StoreService = {
      status: "down",
      serviceRunner: null,
      projectRunner: null,
      port: null,
      processId: null,
    };

    await updateStore("services", serviceName, json);

    console.log(
      `Installed ${chalk.green(serviceName)} service in ${chalk.green(
        join(directoryPath)
      )}`
    );

    console.log(chalk.yellow("Verifying metadata for other services.."));

    // Validate metadata
    await validateMetadata();
    await validateServices();

    console.log(chalk.green("Metadata verified"));
  }
}
