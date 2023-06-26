import { join } from "path";
import yaml from "js-yaml";

import { exists } from "./fs-exists";
import { readfile } from "./fs-readfile";
import { exitWithMsg } from "./exit-with-msg";

import { ISealVMConfig } from "../typings/sealvm-config";
import { Seal } from "../typings/seal";

import { SEALVM } from "../constants";

export const validateSealFile = async (
  localPath: string
): Promise<ISealVMConfig> => {
  const sealvmConfigPath = join(localPath, SEALVM.CONFIG_FILE);

  if (!(await exists(sealvmConfigPath))) {
    exitWithMsg(`${SEALVM.CONFIG_FILE} File Does not exist`);
  }

  const sealYmlContent = await readfile(sealvmConfigPath);
  const sealConfigs: Seal = yaml.load(sealYmlContent) as Seal;

  if (!sealConfigs.server["vm"]) {
    exitWithMsg(`No configuration found for vm in ${SEALVM.CONFIG_FILE}`);
  }

  const sealVmConfigs = sealConfigs.server["vm"];
  return { ...sealVmConfigs, projectId: sealConfigs.project_id };
};
