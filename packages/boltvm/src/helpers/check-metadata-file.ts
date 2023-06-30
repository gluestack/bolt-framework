import os from "os";
import { join } from "path";

import { BOLTVM } from "../constants/bolt-vm";
import { exists } from "./fs-exists";
import { createFolder } from "./fs-mkdir";
import { writefile } from "./fs-writefile";
import { exitWithMsg } from "./exit-with-msg";

export const checkMetadataFile = async () => {
  const metaDataDirectory = join(os.homedir(), BOLTVM.METADATA_FOLDER);
  const metaDataFile = join(metaDataDirectory, BOLTVM.METADATA_FILE);

  try {
    if (!(await exists(metaDataDirectory))) {
      await createFolder(metaDataDirectory);
    }
    if (!(await exists(metaDataFile))) {
      await writefile(
        metaDataFile,
        JSON.stringify({
          projects: {},
        })
      );
    }
  } catch (error: any) {
    exitWithMsg(`Error in validating ${metaDataFile}`, error);
  }
};
