import chalk from "chalk";
import { join } from "path";

import { execute } from "../helpers/execute";
import { exists } from "../helpers/fs-exists";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { validateSealFile } from "../helpers/validate-seal-file";
import { validateProjectStatus } from "../helpers/validate-project-status";
import { SEALVM } from "../constants";

export default async function (localPath: string, options: any) {
  try {
    const isFollow = options.follow || false;

    // Check for file path exists or not
    if (!(await exists(localPath))) {
      exitWithMsg(">> Please specify correct path to initialize");
      return;
    }

    // Check for valid sealvm yml file
    const sealConfig = await validateSealFile(localPath);

    // Check if project is already down
    await validateProjectStatus(sealConfig.projectId, "log");

    // Check if .logs folder exists
    const vmLogPath = join(localPath, SEALVM.LOG_FOLDER, "vm");
    if (!(await exists(vmLogPath))) {
      exitWithMsg(">> No .logs folder found");
    }

    // Check if out.logs and err.logs file exists
    const outputLogPath = join(vmLogPath, "out.log");
    const errorLogPath = join(vmLogPath, "err.log");
    if (!(await exists(outputLogPath))) {
      console.log(
        chalk.red(`>> out.logs file not found for ${sealConfig.projectId}`)
      );
      return;
    }
    if (!(await exists(errorLogPath))) {
      console.log(
        chalk.red(`>> err.logs file not found for ${sealConfig.projectId}`)
      );
      return;
    }

    const catLogsCommand = `cat  ${join(vmLogPath, "*.log")}`;
    const tailLogsCommand = `tail -f ${join(vmLogPath, "*.log")}`;
    const executableCommand = isFollow ? tailLogsCommand : catLogsCommand;

    console.log(chalk.gray(`$ ${executableCommand}`));

    const args: string[] = ["-c", `'${executableCommand}'`];
    await execute("sh", args, {
      stdio: "inherit",
      shell: true,
    });
  } catch (err: any) {
    console.log(chalk.red("Error while getting logs: ", err.message));
  }
}
