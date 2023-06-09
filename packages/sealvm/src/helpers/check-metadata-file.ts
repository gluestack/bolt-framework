import os from "os";
import { join } from "path";

import { SEALVM } from "../constants";
import { exists } from "./fs-exists";
import { createFolder } from "./fs-mkdir";
import { writefile } from "./fs-writefile";
import { exitWithMsg } from "./exit-with-msg";

export const checkMetadataFile = async () => {
  try {
    const metaDataDirectory = join(os.homedir(), SEALVM.METADATA_FOLDER);
    if (!(await exists(metaDataDirectory))) {
      await createFolder(metaDataDirectory);
    }
    const metaDataFile = join(metaDataDirectory, SEALVM.METADATA_FILE);
    if (!(await exists(metaDataFile))) {
      await writefile(
        metaDataFile,
        JSON.stringify({
          projects: {},
        })
      );
    }
  } catch (error: any) {
    exitWithMsg(`Error in validating ${SEALVM.METADATA_FILE}`, error);
  }
};
