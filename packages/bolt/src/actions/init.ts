import * as os from "os";
import chalk from "chalk";
import moment from "moment";
import BoltVM from "@gluestack/boltvm";
import { find, findIndex } from "lodash";
import { basename, join, relative } from "path";

import { exists } from "../helpers/fs-exists";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { readfile } from "../helpers/fs-readfile-json";
import { writefile } from "../helpers/fs-writefile";
import { createFolder } from "../helpers/fs-mkdir";
import { stringifyYAML } from "../helpers/stringify-yaml";

import { boltFile } from "../constants/bolt-file";
import { BOLT } from "../constants/bolt-configs";

import { Bolt } from "../typings/bolt";
import { removeSpecialChars } from "@gluestack/helpers";

export default class Init {
  public async handle(options: any) {
    try {
      // if service doesn't exists, exit
      const _projectPath = process.cwd();
      const _projectName = options.name ? options.name : basename(_projectPath);
      const _projectFolderPath = join(os.homedir(), BOLT.PROCESS_FOLDER_NAME);
      const ID = moment().valueOf().toString();
      const _projectListPath = join(
        _projectFolderPath,
        BOLT.PROCESS_PROJECT_LIST_FILE_NAME
      );
      const _yamlPath = join(BOLT.YAML_FILE_NAME);
      const _envPath = join(".env.tpl");

      // check if given service has a bolt.yaml file
      const _yamlExists: string | boolean = await exists(_yamlPath);

      // if yaml doesn't exists, exit
      if (_yamlExists) {
        throw new Error(
          `>> Cannot init "${relative(".", _yamlPath)}" file already exists`
        );
      }

      const json: Bolt = {
        ...boltFile,
        project_id: `${ID}`,
        project_name: `${_projectName}`,
      };

      if (json.vm) {
        json.vm.name = removeSpecialChars(basename(_projectPath));
      }

      await stringifyYAML(json, _yamlPath);
      await writefile(_envPath, "" + os.EOL);

      if (!(await exists(_projectFolderPath))) {
        await createFolder(_projectFolderPath);
      }

      const data: any[] = (await readfile(_projectListPath)) || [];

      const _projectExists = find(data, { id: ID });

      if (!_projectExists) {
        data.push({
          id: ID,
          name: _projectName,
        });
      } else {
        const index = findIndex(data, { id: ID });
        data[index] = {
          id: ID,
          name: _projectName,
        };
      }
      await writefile(_projectListPath, JSON.stringify(data) + os.EOL);

      // if vm is present in json, add metadata
      if (json.vm) {
        const boltVM = new BoltVM(_projectPath);
        await boltVM.addMetadata();
      }

      console.log(`>> Installed bolt in ${chalk.green(_projectPath)}`);
    } catch (err: any) {
      await exitWithMsg(err.message || err);
    }
  }
}
