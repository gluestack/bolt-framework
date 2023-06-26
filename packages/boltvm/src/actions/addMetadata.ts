import { SEALVM } from "../constants";

import { exists } from "../helpers/fs-exists";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { updateStore } from "../helpers/update-store";
import { checkMetadataFile } from "../helpers/check-metadata-file";
import { IMetadata } from "../typings/metadata";
import { ISealVMConfig } from "../typings/sealvm-config";
import { validateSealFile } from "../helpers/validate-seal-file";
import { getStore } from "../helpers/get-store";
import chalk from "chalk";

export async function createProject(sealConfig: ISealVMConfig) {
  const json: IMetadata = {
    projectName: sealConfig.name,
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

  const store = await getStore();
  const storeData = store.get("projects") || {};
  const projectId = sealConfig.projectId;

  if (storeData[projectId]) {
    return storeData[projectId] as IMetadata;
  }

  console.log(
    `>> Creating ${chalk.green(sealConfig.name)}'s configurations for sealvm...`
  );

  await updateStore("projects", projectId, json);

  console.log(
    `>> Successfully created ${chalk.green(
      sealConfig.name
    )}'s configurations for sealvm...`
  );

  return json;
}

export default async (localPath: string) => {
  try {
    // Validate Path
    if (!(await exists(localPath))) {
      exitWithMsg(">> Please specify correct path in source");
      return;
    }

    // Check for valid sealvm yml file
    const sealConfig = await validateSealFile(localPath);

    // Create SealVM Metadata
    await checkMetadataFile();

    await createProject(sealConfig);
  } catch (error: any) {
    exitWithMsg(`Error while creating ${SEALVM.CONFIG_FILE}`, error.message);
  }
};
