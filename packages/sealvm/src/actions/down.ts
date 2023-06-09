import chalk from "chalk";
import { join } from "path";

import { exists } from "../helpers/fs-exists";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { killProcess } from "../helpers/kill-process";
import { updateStore } from "../helpers/update-store";
import { validateSealFile } from "../helpers/validate-seal-file";

import VM from "../runners/vm";

import { validateProjectStatus } from "../helpers/validate-project-status";

import { IMetadata } from "../typings/metadata";

export default async function (projectPath: string) {
  const localPath =
    projectPath === "." ? process.cwd() : join(process.cwd(), projectPath);

  if (!(await exists(localPath))) {
    exitWithMsg(">> Please specify correct path to the project");
    return;
  }

  const sealConfig = await validateSealFile(localPath);

  const project = await validateProjectStatus(sealConfig.name, "down");

  // Unmounting the project
  console.log(chalk.yellow(`>> Unmounting project...`));
  await killProcess(project.mountProcessId as number);
  console.log(chalk.green(`>> Project unmounted successfully...\n`));

  // Killing VM process
  console.log(chalk.yellow(`>> Exiting from VM...`));
  await VM.destroy(project.vmProcessId as number);
  console.log(chalk.green(`>> VM exited successfully...\n`));

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

  await updateStore("projects", sealConfig.name, json);

  console.log(chalk.green(`>> Project "${sealConfig.name}" is down`));
}
