import { join } from "path";
import * as os from "os";

import { exists } from "../helpers/fs-exists";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { readfile } from "../helpers/fs-readfile-json";
import { ConsoleTable } from "@gluestack/helpers";

export default async (): Promise<void> => {
  try {
    // if service doesn't exists, exit

    const _projectListPath = join(os.homedir(), ".seal", "projects.json");

    const _projectListExists: string | boolean = await exists(_projectListPath);
    if (!_projectListExists) {
      throw new Error(`> There are no available seal projects`);
    }

    const data: any[] = (await readfile(_projectListPath)) || [];
    if (!data || !data.length) {
      throw new Error(`> There are no available seal projects`);
    }

    const head: string[] = ["#", "Project Name", "Path"];

    const rows: any = [];

    data.map((item, index) => {
      rows.push([item.id, item.name, item.path]);
    });

    ConsoleTable.print(head, rows);
  } catch (err: any) {
    await exitWithMsg(err.message || err);
  }
};
