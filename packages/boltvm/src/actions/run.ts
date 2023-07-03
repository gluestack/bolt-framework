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
    projectConfig: IBolt,
    localPath: string,
    isDetatched: boolean
  ) {
    const { vm } = projectConfig;
    const args = [
      "-p",
      `${vmPort}`,
      ...SSH_CONFIG,
      `"${VM_INTERNALS_CONFIG.command} && ${vm.command}"`,
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

  // Expose port to host machine
  private async exposePort(vmPort: number, port: string) {
    console.log(chalk.yellow(`>> Exposing port ${port}`));

    if (!port.includes(":")) {
      console.log(chalk.red(`>> Invalid port mapping ${port}`));
      return null;
    }

    const portMap = port.split(":");
    port = `${portMap[0]}:localhost:${portMap[1]}`;
    const args = ["-p", `${vmPort}`, "-N", "-L", port, ...SSH_CONFIG];

    const sshPid = await executeDetached(
      "ssh",
      args,
      { detached: true },
      "ssh"
    );
    return sshPid;
  }

  public async handle(localPath: string, detatched: any) {
    try {
      // Check for file path exists or not
      if (!(await exists(localPath))) {
        exitWithMsg(">> Please specify correct path in source");
        return;
      }

      // Check for valid boltvm yml file
      const boltConfig = await validateBoltYaml(localPath);

      const { vm, project_id } = boltConfig;

      // Check if boltvm is up or not
      const project = await validateProjectStatus("run", boltConfig);

      const sshPort = project.sshPort as number;
      const conn = await VM.connectOnce(sshPort);
      await conn.end();

      // Expose ports
      const portExposePromises: any = [];
      for (const port of vm.ports) {
        portExposePromises.push(this.exposePort(sshPort, port));
      }

      const sshPids: number[] | null[] = await Promise.all(portExposePromises);
      console.log(chalk.green(">> Ports exposed"));

      // Run project inside vm
      console.log(chalk.yellow(">> Started running project inside VM..."));
      const projectRunnerId =
        (await this.runProjectInsideVm(
          sshPort,
          boltConfig,
          localPath,
          detatched
        )) ?? 0;
      console.log(chalk.green(">> Project running inside VM"));

      // Update project status
      const json: IMetadata = {
        ...project,
        status: "up",
        sshProcessIds: sshPids,
        projectRunnerId: projectRunnerId,
      };
      await updateStore("projects", project_id, json);

      // Kill process on ctrl+c
      process.on("SIGINT", () => {
        (async () => {
          console.log(chalk.yellow(">> Killing process..."));
          await killMultipleProcesses([...sshPids, projectRunnerId]);
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
