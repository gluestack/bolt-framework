import chalk from "chalk";
import { spawn } from "child_process";
import { join } from "path";
import { BOLTVM, SSH_CONFIG, VM_INTERNALS_CONFIG } from "../constants/bolt-vm";
import { executeDetachedWithLogs } from "../helpers/execute-detached";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { exists } from "../helpers/fs-exists";
import { validateBoltYaml } from "../helpers/validate-bolt-file";
import { validateProjectStatus } from "../helpers/validate-project-status";
import Vm from "../runners/vm";

export default class ExecuteCommand {
  boltInstall: boolean;

  constructor(boltInstall: boolean) {
    this.boltInstall = boltInstall;
  }

  private async runCommandInsideVm(
    vmPort: number,
    command: String,
    localPath: string,
    isDetatched: boolean
  ) {
    const { projectCdCommand, boltInstallationCommand } = VM_INTERNALS_CONFIG;

    // Configuring command to run inside VM
    let mainCommand = `${projectCdCommand} && ${command}`;
    mainCommand = this.boltInstall
      ? `${boltInstallationCommand} && ${mainCommand}`
      : mainCommand;

    const args = ["-p", `${vmPort}`, ...SSH_CONFIG, `"${mainCommand}"`];

    if (isDetatched) {
      // Runs the command in detatch mode and store its logs into log files
      return await executeDetachedWithLogs(
        "ssh",
        args,
        join(localPath, BOLTVM.LOG_FOLDER, "command_logs"),
        {
          shell: true,
          detached: true,
        },
        "Command Runner"
      );
    } else {
      // Runs the command in foreground mode
      const child = spawn("ssh", args, {
        stdio: "inherit",
        shell: true,
      });
      return child.pid;
    }
  }

  public async handle(command: string, localPath: string, detatched: any) {
    // Check for file path exists or not
    if (!(await exists(localPath))) {
      exitWithMsg(">> Please specify correct path in source");
      return;
    }

    // Check for valid boltvm yml file
    const boltConfig = await validateBoltYaml(localPath);

    // Check if boltvm is up or not
    const project = await validateProjectStatus("run", boltConfig);

    const vmPort = project.sshPort as number;
    const conn = await Vm.connectOnce(vmPort);
    await conn.end();

    console.log(chalk.green(`>> Started running ${command} inside VM...`));
    // Run command inside vm
    await this.runCommandInsideVm(vmPort, command, localPath, detatched);
    console.log(chalk.green(`>> Executed ${command} successfully in VM!`));
  }
}
