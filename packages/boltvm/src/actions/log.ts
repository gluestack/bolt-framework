import chalk from "chalk";
import { join } from "path";

import { execute } from "../helpers/execute";
import { exists } from "../helpers/fs-exists";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { validateBoltYaml } from "../helpers/validate-bolt-file";
import { validateProjectStatus } from "../helpers/validate-project-status";
import { BOLTVM } from "../constants/bolt-vm";

export default class Log {
  public async handle(localPath: string, isFollow: boolean) {
    try {
      // Check for file path exists or not
      if (!(await exists(localPath))) {
        exitWithMsg(">> Please specify correct path to initialize");
        return;
      }

      // Check for valid boltvm yml file
      const boltConfig = await validateBoltYaml(localPath);

      const { project_name } = boltConfig;
      // Check if project is already down
      await validateProjectStatus("log", boltConfig);

      // Check if .logs folder exists
      const vmLogPath = join(localPath, BOLTVM.LOG_FOLDER);
      if (!(await exists(vmLogPath))) {
        exitWithMsg(">> No .logs folder found");
      }

      // Check if out.logs and err.logs file exists
      const outputLogPath = join(vmLogPath, "out.log");
      const errorLogPath = join(vmLogPath, "err.log");
      if (!(await exists(outputLogPath))) {
        console.log(
          chalk.red(`>> ${outputLogPath} file not found for ${project_name}`)
        );
        return;
      }
      if (!(await exists(errorLogPath))) {
        console.log(
          chalk.red(`>> ${errorLogPath} file not found for ${project_name}`)
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
}
