import * as os from "os";
import { join } from "path";
import { getAndValidateSealYaml } from "../actions/up";
import Store from "../libraries/store";

export default async function getStore() {
    const _yamlContent = await getAndValidateSealYaml();
    const _sealFolderPath = join(os.homedir(), ".seal");
    const _sealFilePath = join(
      _sealFolderPath,
      `${_yamlContent.project_id}.json`,
    );
    const store = new Store(_sealFilePath);
    store.restore();
    return store;
}