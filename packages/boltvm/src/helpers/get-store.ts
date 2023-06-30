import * as os from "os";
import { join } from "path";
import Store from "../libraries/store";
import { BOLTVM } from "../constants/bolt-vm";

export const getStore = async () => {
  const boltVmFolderPath = join(os.homedir(), BOLTVM.METADATA_FOLDER);
  const boltVmFilePath = join(boltVmFolderPath, BOLTVM.METADATA_FILE);

  const store = new Store(boltVmFilePath);
  store.restore();

  return store;
};
