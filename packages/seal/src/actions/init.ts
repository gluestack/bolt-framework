import { join, relative } from "path";
import * as os from "os";

import { exists } from "../helpers/fs-exists";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { readfile } from "../helpers/fs-readfile-json";
import { writefile } from "../helpers/fs-writefile";
import { createFolder } from "../helpers/fs-mkdir";
import { find } from "lodash";
import chalk from "chalk";
import moment from "moment";

export default async (): Promise<void> => {
  try {
    // if service doesn't exists, exit

    const _projectPath = process.cwd();
    const _projectName =
      _projectPath.split("/")[_projectPath.split("/").length - 1];
    const _projectFolderPath = join(os.homedir(), ".seal");
    const ID = moment().valueOf().toString();
    const _projectListPath = join(_projectFolderPath, "projects.json");
    const _yamlPath = join("seal.yaml");
    const _envPath = join(".env.tpl");

    // check if given service has a seal.yaml file
    const _yamlExists: string | boolean = await exists(_yamlPath);

    // if yaml doesn't exists, exit
    if (_yamlExists) {
      throw new Error(
        `> Cannot init "${relative(".", _yamlPath)}" file already exists`
      );
    }
    await writefile(
      _yamlPath,
      `envfile: .env.tpl
project_id: "${ID}"
project_name: ${_projectName}
default_runner: local
services:
ingress:` + os.EOL
    );
    await writefile(_envPath, "" + os.EOL);

    if (!(await exists(_projectFolderPath))) {
      await createFolder(_projectFolderPath);
    }

    const data: any[] = (await readfile(_projectListPath)) || [];

    if (!find(data, { path: _projectPath })) {
      data.push({
        id: ID,
        name: _projectName,
        path: _projectPath,
      });
    }
    await writefile(_projectListPath, JSON.stringify(data) + os.EOL);

    console.log(`> Installed seal in ${chalk.green(_projectPath)}`);
  } catch (err: any) {
    await exitWithMsg(err.message || err);
  }
};
