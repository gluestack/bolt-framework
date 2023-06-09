import * as os from "os";
import { join } from "path";
import Store from "../libraries/store";
import { SEALVM } from "../constants";

export const getStore = async () => {
  const _sealFolderPath = join(os.homedir(), SEALVM.METADATA_FOLDER);
  const _sealFilePath = join(_sealFolderPath, SEALVM.METADATA_FILE);

  const store = new Store(_sealFilePath);
  store.restore();

  return store;
};
