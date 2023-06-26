import { join } from "path";
import os from "os";
import { find, findIndex } from "lodash";

// import addMetadata from "@gluestack-v2/sealvm/build/actions/addMetadata";

import { exists } from "./fs-exists";
import { createFolder } from "./fs-mkdir";
import { readfile } from "./fs-readfile-json";
import { writefile } from "./fs-writefile";
import { exitWithMsg } from "./exit-with-msg";
import Common from "../common";
import { BOLT } from "../constants/bolt-configs";

export const validateMetadata = async (option?: any) => {
  try {
    let _yamlContent = await Common.getAndValidateBoltYaml();

    const _projectFolderPath = join(os.homedir(), BOLT.YAML_FILE_NAME);
    const _projectListPath = join(
      _projectFolderPath,
      BOLT.PROCESS_PROJECT_LIST_FILE_NAME
    );

    const _projectPath = process.cwd();

    if (!(await exists(_projectFolderPath))) {
      await createFolder(_projectFolderPath);
    }

    const data: any[] = (await readfile(_projectListPath)) || [];
    const _projectExists = find(data, { id: _yamlContent.project_id });

    if (!_projectExists) {
      data.push({
        id: _yamlContent.project_id,
        name: _yamlContent.project_name,
      });
    } else {
      const index = findIndex(data, { id: _yamlContent.project_id });
      data[index] = {
        id: _yamlContent.project_id,
        name: _yamlContent.project_name,
      };
    }

    await writefile(_projectListPath, JSON.stringify(data) + os.EOL);

    // await addMetadata(_projectPath);
  } catch (error: any) {
    exitWithMsg(`Error while validating metatdata: ${error}`);
  }
};
