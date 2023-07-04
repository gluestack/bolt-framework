import chalk from "chalk";
import { join } from "path";
import { spawn } from "child_process";

import { exists } from "../helpers/fs-exists";
import { updateStore } from "../helpers/update-store";
import { killMultipleProcesses } from "../helpers/kill-process";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { validateBoltYaml } from "../helpers/validate-bolt-file";
import {
  executeDetached,
  executeDetachedWithLogs,
} from "../helpers/execute-detached";
import { validateProjectStatus } from "../helpers/validate-project-status";

import { IMetadata } from "../typings/metadata";

import VM from "../runners/vm";
import { BOLTVM, SSH_CONFIG, VM_INTERNALS_CONFIG } from "../constants/bolt-vm";
import { IBolt } from "../typings/bolt";

export default class Run {
  private async runProjectInsideVm(
    vmPort: number,
    command: String,
    localPath: string,
    isDetatched: boolean
  ) {
    const args = [
      "-p",
      `${vmPort}`,
      ...SSH_CONFIG,
      `"${VM_INTERNALS_CONFIG.command} && ${command}"`,
    ];

    if (isDetatched) {
      // Runs the project in detatch mode and store its logs into log files
      return await executeDetachedWithLogs(
        "ssh",
        args,
        join(localPath, BOLTVM.LOG_FOLDER, "project_runner"),
        {
          shell: true,
          detached: true,
        },
        "Project Runner"
      );
    } else {
      // Runs the project in foreground mode
      const child = spawn("ssh", args, {
        stdio: "inherit",
        shell: true,
      });
      return child.pid;
    }
  }

  public async handle(command: string, localPath: string, detatched: any) {
    try {
      // Check for file path exists or not
      if (!(await exists(localPath))) {
        exitWithMsg(">> Please specify correct path in source");
        return;
      }

      // Check for valid boltvm yml file
      const boltConfig = await validateBoltYaml(localPath);

      const { project_id } = boltConfig;

      // Check if boltvm is up or not
      const project = await validateProjectStatus("run", boltConfig);

      const vmPort = project.sshPort as number;
      const conn = await VM.connectOnce(vmPort);
      await conn.end();

      // Run project inside vm
      console.log(chalk.yellow(">> Started running project inside VM..."));
      const projectRunnerId =
        (await this.runProjectInsideVm(
          vmPort,
          command,
          localPath,
          detatched
        )) ?? 0;
      console.log(chalk.green(">> Project running inside VM"));

      // Update project status
      const json: IMetadata = {
        ...project,
        status: "up",
        projectRunnerId: projectRunnerId,
      };
      await updateStore("projects", project_id, json);

      // Kill process on ctrl+c
      process.on("SIGINT", () => {
        (async () => {
          console.log(chalk.yellow(">> Killing process..."));
          await updateStore("projects", project_id, {
            ...project,
            status: "build",
            sshProcessIds: null,
            projectRunnerId: null,
          });

          process.exit(0);
        })();
      });
    } catch (err: any) {
      exitWithMsg(err.message);
    }
  }
}
