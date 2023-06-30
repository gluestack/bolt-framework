import chalk from "chalk";

import { exists } from "../helpers/fs-exists";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { killProcess } from "../helpers/kill-process";
import { updateStore } from "../helpers/update-store";
import { validateBoltYaml } from "../helpers/validate-bolt-file";

import VM from "../runners/vm";

import { validateProjectStatus } from "../helpers/validate-project-status";

import { IMetadata } from "../typings/metadata";

export default class Down {
  public async handle(localPath: string) {
    try {
      // Check for file path exists or not
      if (!(await exists(localPath))) {
        exitWithMsg(">> Please specify correct path in source");
        return;
      }

      const boltConfig = await validateBoltYaml(localPath);

      const { project_id } = boltConfig;

      const project = await validateProjectStatus("down", boltConfig);

      // Unmounting the project
      console.log(chalk.yellow(`>> Unmounting project...`));
      await killProcess(project.mountProcessId as number);
      console.log(chalk.green(`>> Project unmounted successfully...`));

      // Killing VM process
      console.log(chalk.yellow(`>> Exiting from VM...`));
      await VM.destroy(project.vmProcessId as number);
      console.log(chalk.green(`>> VM exited successfully...`));

      // Updating metadata
      const json: IMetadata = {
        ...project,
        sshPort: null,
        status: "down",
        vmProcessId: null,
        mountProcessId: null,
        sshProcessIds: null,
        projectRunnerId: null,
        updatedAt: Date.now(),
      };

      await updateStore("projects", project_id, json);
    } catch (error: any) {
      exitWithMsg(`Error while stopping VM: ${error.message}`);
    }
  }
}
