import { join } from "path";
import yaml from "js-yaml";
import { exists } from "./fs-exists";
import { readfile } from "./fs-readfile";
import { exitWithMsg } from "./exit-with-msg";
import { IBolt } from "../typings/bolt";
import { BOLT } from "../constants/bolt";

export const validateBoltYaml = async (localPath: string): Promise<IBolt> => {
  const boltVmConfigPath = join(localPath, BOLT.CONFIG_FILE);

  if (!(await exists(boltVmConfigPath))) {
    exitWithMsg(`${BOLT.CONFIG_FILE} File Does not exist`);
  }

  const boltYmlContent = await readfile(boltVmConfigPath);
  const boltConfigs: IBolt = yaml.load(boltYmlContent) as IBolt;

  // if (!boltConfigs.vm) {
  //   exitWithMsg(`No configuration found for vm in ${BOLT.CONFIG_FILE}`);
  // }

  return boltConfigs;
};
