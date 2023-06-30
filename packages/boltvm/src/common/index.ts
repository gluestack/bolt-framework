import chalk from "chalk";
import { getStore } from "../helpers/get-store";
import { updateStore } from "../helpers/update-store";
import { IBolt } from "../typings/bolt";
import { IMetadata, IProject } from "../typings/metadata";

export default class Common {
  static async createProjectMetadata(boltConfig: IBolt): Promise<IMetadata> {
    const json: IMetadata = {
      projectName: boltConfig.project_name,
      containerPath: null,
      sshPort: null,
      status: "down",
      vmProcessId: null,
      mountProcessId: null,
      sshProcessIds: null,
      projectRunnerId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const store = await getStore();
    const storeData: IProject = store.get("projects") || {};
    const projectId = boltConfig.project_id;

    if (storeData[projectId]) {
      return storeData[projectId];
    }

    console.log(
      `>> Creating ${chalk.green(
        boltConfig.project_name
      )}'s configurations for boltvm...`
    );

    await updateStore("projects", projectId, json);

    console.log(
      `>> Successfully created ${chalk.green(
        boltConfig.project_name
      )}'s configurations for boltvm...`
    );

    return json;
  }
}
