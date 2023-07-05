import chalk from "chalk";
import { join } from "path";
import { spawn } from "child_process";

import { exists } from "../helpers/fs-exists";
import { updateStore } from "../helpers/update-store";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { validateBoltYaml } from "../helpers/validate-bolt-file";
import { executeDetachedWithLogs } from "../helpers/execute-detached";
import { validateProjectStatus } from "../helpers/validate-project-status";

import { IMetadata } from "../typings/metadata";

import VM from "../runners/vm";

import { BOLTVM, SSH_CONFIG, VM_INTERNALS_CONFIG } from "../constants/bolt-vm";

export default class Run {
  private async runProjectInsideVm(
    vmPort: number,
    command: String,
    localPath: string,
    isDetatched: boolean
  ) {
    const { projectCdCommand, boltInstallationCommand } = VM_INTERNALS_CONFIG;

    // Configuring command to run inside VM
    const mainCommand = `${projectCdCommand} && ${command}`;

    const args = ["-p", `${vmPort}`, ...SSH_CONFIG, `"${mainCommand}"`];

    if (isDetatched) {
      // Runs the project in detatch mode and store its logs into log files
      return await executeDetachedWithLogs(
        "ssh",
        args,
        join(localPath, BOLTVM.LOG_FOLDER, "project_logs"),
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
      const project = await validateProjectStatus("exec", boltConfig);

      const vmPort = project.sshPort as number;
      const conn = await VM.connectOnce(vmPort);
      await conn.end();

      let serviceName = command.split("bolt service:up ")[1];
      serviceName = serviceName.split(" ")[0];
      console.log(
        chalk.green(`>> Started running ${serviceName} inside VM...`)
      );
      // Run project inside vm
      await this.runProjectInsideVm(vmPort, command, localPath, detatched);
      console.log(chalk.green(`>> Started ${serviceName} successfully in VM!`));

      // Update project status
      const json: IMetadata = {
        ...project,
        status: "up",
      };
      await updateStore("projects", project_id, json);

      // Kill process on ctrl+c
      process.on("SIGINT", () => {
        (async () => {
          process.exit(0);
        })();
      });
    } catch (err: any) {
      exitWithMsg(err.message);
    }
  }
}
