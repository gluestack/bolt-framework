import { join } from "path";
import * as os from "os";

import { exists } from "../helpers/fs-exists";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { readfile } from "../helpers/fs-readfile-json";
import { ConsoleTable } from "@gluestack/helpers";
import { BOLT } from "../constants/bolt-configs";

export default class ProjectList {
  public async handle(): Promise<void> {
    try {
      const _projectListPath = join(
        os.homedir(),
        BOLT.PROCESS_FOLDER_NAME,
        BOLT.PROCESS_PROJECT_LIST_FILE_NAME
      );
      const _projectListExists: string | boolean = await exists(
        _projectListPath
      );

      if (!_projectListExists) {
        throw new Error(`> There are no available Bolt projects`);
      }

      const data: any[] = (await readfile(_projectListPath)) || [];
      if (!data || !data.length) {
        throw new Error(`> There are no available Bolt projects`);
      }

      const head: string[] = ["#", "Project Id", "Project Name"];

      const rows: any = [];

      let counter: number = 0;
      data.forEach((item) => {
        counter++;
        rows.push([counter, item.id, item.name]);
      });

      ConsoleTable.print(head, rows);
    } catch (err: any) {
      await exitWithMsg(err.message || err);
    }
  }
}
