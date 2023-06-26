import * as os from "os";
import { join } from "path";
import Common from "../common";

import { BOLT } from "../constants/bolt-configs";
import Store from "../libraries/store";

export default async function getStore() {
  const _yamlContent = await Common.getAndValidateBoltYaml();
  const _boltFolderPath = join(os.homedir(), BOLT.PROCESS_FOLDER_NAME);
  const _boltFilePath = join(
    _boltFolderPath,
    `${_yamlContent.project_id}.json`
  );
  const store = new Store(_boltFilePath);
  store.restore();
  return store;
}
