import yaml from "js-yaml";
import chalk from "chalk";
import { basename, join } from "path";

import { SEALVM, YAMLDATA } from "../constants";

import { exists } from "../helpers/fs-exists";
import { writefile } from "../helpers/fs-writefile";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { updateStore } from "../helpers/update-store";
import { checkMetadataFile } from "../helpers/check-metadata-file";
import { removeSpecialCharacters } from "../helpers/remove-special-characters";
import { IMetadata } from "../typings/metadata";
import { ISealVMConfig } from "../typings/sealvm-config";

async function YamlContent(localPath: string) {
  const data: ISealVMConfig = {
    name: removeSpecialCharacters(basename(localPath)),
    source: localPath,
    ...YAMLDATA,
  };
  return yaml.dump(data);
}

async function createProject(sealConfig: ISealVMConfig) {
  const json: IMetadata = {
    path: sealConfig.source,
    containerPath: "",
    sshPort: null,
    status: "down",
    vmProcessId: null,
    mountProcessId: null,
    sshProcessIds: null,
    projectRunnerId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await updateStore("projects", sealConfig.name, json);
}

export default async (localPath: string) => {
  try {
    localPath =
      localPath === "." ? process.cwd() : join(process.cwd(), localPath);
    // Validate Path
    if (!(await exists(localPath))) {
      exitWithMsg(">> Please specify correct path to initialize");
      return;
    }

    // Validate if Sealfile already exists
    if (await exists(join(localPath, SEALVM.CONFIG_FILE))) {
      exitWithMsg(`>> ${SEALVM.CONFIG_FILE} already exists`);
      return;
    }

    // Get Yaml Content
    const yamlContent = await YamlContent(localPath);

    // Create Sealfile
    await writefile(join(localPath, SEALVM.CONFIG_FILE), yamlContent);

    // Create SealVM Metadata
    await checkMetadataFile();

    // Create project
    const projectConfig: ISealVMConfig = yaml.load(
      yamlContent
    ) as ISealVMConfig;
    await createProject(projectConfig);

    console.log(
      `>> Installed ${SEALVM.CONFIG_FILE} in ${chalk.green(localPath)}`
    );
  } catch (error: any) {
    exitWithMsg(`Error while creating ${SEALVM.CONFIG_FILE}`, error.message);
  }
};
