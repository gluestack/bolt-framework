import { exists } from "../helpers/fs-exists";
import { isEmpty } from "lodash";
import { join, relative } from "path";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { parseYAML } from "../helpers/parse-yaml";
import { validateBolt } from "../validations/bolt";
import { validateBoltService } from "../validations/bolt-service";
import chalk from "chalk";
import { execute } from "../helpers/execute";
import { BOLT } from "../constants/bolt-configs";
import { Bolt } from "../typings/bolt";
import { closestMatch } from "closest-match";
import getStore from "../helpers/get-store";

export default class Common {
  public static async getAndValidateBoltYaml() {
    const _yamlPath = join(BOLT.YAML_FILE_NAME);
    if (!(await exists(_yamlPath))) {
      await exitWithMsg(`>> "${_yamlPath}" doesn't exists`);
    }

    const _yamlContent = await validateBolt(await parseYAML(_yamlPath));
    if (
      !_yamlContent ||
      !_yamlContent.services ||
      isEmpty(_yamlContent.services)
    ) {
      await exitWithMsg(`>> "${BOLT.YAML_FILE_NAME}" services does not exists`);
    }

    return _yamlContent;
  }

  public static async getAndValidateService(
    serviceName: string,
    _yamlContent: any
  ) {
    // if service doesn't exists, exit
    const servicePath: string = join(
      process.cwd(),
      _yamlContent.services[serviceName].path
    );

    if (!(await exists(servicePath))) {
      await exitWithMsg(
        `>> service ${relative(".", servicePath)} doesn't exists`
      );
    }

    // check if given service has a bolt.service.yaml file
    const _serviceYamlPath: string | boolean = await exists(
      join(servicePath, "bolt.service.yaml")
    );

    // if yaml doesn't exists, exit
    if (!_serviceYamlPath) {
      await exitWithMsg(
        `>> service ${relative(
          ".",
          join(servicePath, "bolt.service.yaml")
        )} file doesn't exists`
      );
    }

    const yamlPath = _serviceYamlPath as string;

    const content = await validateBoltService(await parseYAML(yamlPath));

    return { servicePath, _serviceYamlPath, yamlPath, content };
  }

  public static async generateEnv() {
    const args: string[] = ["env:generate"];

    console.log(chalk.gray("$ bolt", args.join(" ")));

    await execute("bolt", args, {
      cwd: process.cwd(),
      shell: true,
    });
  }

  public static async validateServiceInBoltYaml(serviceName: string) {
    const _yamlPath = join(BOLT.YAML_FILE_NAME);
    if (!(await exists(_yamlPath))) {
      await exitWithMsg(`>> "${_yamlPath}" doesn't exists`);
    }

    const _yamlContent: Bolt = await validateBolt(await parseYAML(_yamlPath));
    if (
      !_yamlContent ||
      !_yamlContent.services ||
      isEmpty(_yamlContent.services)
    ) {
      await exitWithMsg(`>> "${BOLT.YAML_FILE_NAME}" services does not exists`);
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
}
