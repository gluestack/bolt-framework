import { join } from "path";
import { SEALVM } from "../constants";
import { exists } from "./fs-exists";
import { readfile } from "./fs-readfile";
import yaml from "js-yaml";
import { exitWithMsg } from "./exit-with-msg";
import { ISealVMConfig } from "../typings/sealvm-config";

export const validateSealFile = async (localPath: string) => {
  const sealvmConfigPath = join(localPath, SEALVM.CONFIG_FILE);
  if (!(await exists(sealvmConfigPath))) {
    exitWithMsg(`${SEALVM.CONFIG_FILE} File Does not exist`);
  }

  const sealvmYmlContent = await readfile(sealvmConfigPath);
  const sealvmConfigs: ISealVMConfig = yaml.load(
    sealvmYmlContent
  ) as ISealVMConfig;

  return sealvmConfigs;
};
