import { exists } from "../helpers/fs-exists";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { checkMetadataFile } from "../helpers/check-metadata-file";
import { validateBoltYaml } from "../helpers/validate-bolt-file";
import Common from "../common";
import { BOLT } from "../constants/bolt";

export default class AddMetadata {
  public async handle(localPath: string) {
    try {
      // Validate Path
      if (!(await exists(localPath))) {
        await exitWithMsg(">> Please specify correct path in source");
        return;
      }

      // Check for valid boltvm yml file
      const boltConfig = await validateBoltYaml(localPath);

      // Check metadata for boltvm
      await checkMetadataFile();

      await Common.createProjectMetadata(boltConfig);
    } catch (error: any) {
      await exitWithMsg(
        `Error while creating ${BOLT.CONFIG_FILE} ${error.message}`
      );
    }
  }
}
