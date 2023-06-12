import chalk from "chalk";
import { join } from "path";
import { spawn } from "child_process";

import { exists } from "../helpers/fs-exists";
import { updateStore } from "../helpers/update-store";
import { killMultipleProcesses } from "../helpers/kill-process";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { validateSealFile } from "../helpers/validate-seal-file";
import {
  executeDetached,
  executeDetachedWithLogs,
} from "../helpers/execute-detached";
import { validateProjectStatus } from "../helpers/validate-project-status";

import { IMetadata } from "../typings/metadata";
import { ISealVMConfig } from "../typings/sealvm-config";

import VM from "../runners/vm";

async function runProjectInsideVm(
  projectConfig: ISealVMConfig,
  isDetatched: boolean
) {
  const args = [
    "-p",
    "2222",
    "sealvm@localhost",
    `"cd ${projectConfig.destination} && ${projectConfig.command}"`,
  ];

  if (isDetatched) {
    // Runs the project in detatch mode and store its logs into log files
    return await executeDetachedWithLogs(
      "ssh",
      args,
      join(projectConfig.source, `.sealvm.${projectConfig.name}.info`),
      {
        shell: true,
        detached: true,
      }
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
async function exposePort(port: string) {
  console.log(chalk.yellow(`>> Exposing port ${port}`));

  if (!port.includes(":")) {
    console.log(chalk.red(`>> Invalid port mapping ${port}`));
    return null;
  }

  const portMap = port.split(":");
  port = `${portMap[0]}:localhost:${portMap[1]}`;
  const args = ["-p", "2222", "-N", "-L", port, "sealvm@localhost"];

  const sshPid = await executeDetached("ssh", args, { detached: true });
  return sshPid;
}

export default async function (localPath: string, option: any) {
  try {
    localPath =
      localPath === "." ? process.cwd() : join(process.cwd(), localPath);

    const isDetached = option.detatch || false;

    // Check for file path exists or not
    if (!(await exists(localPath))) {
      exitWithMsg(">> Please specify correct path to run the project");
      return;
    }

    // Check for valid sealvm yml file
    const sealConfig = await validateSealFile(localPath);

    // Check if sealvm is up or not
    const project = await validateProjectStatus(sealConfig.name, "run");

    const conn = await VM.connectOnce();
    conn.end();

    // Expose ports
    const portExposePromises: any = [];
    for (const port of sealConfig.ports) {
      portExposePromises.push(exposePort(port));
    }

    const sshPids: number[] | null[] = await Promise.all(portExposePromises);
    console.log(chalk.green(">> Ports exposed"));

    // Run project inside vm
    console.log(chalk.yellow("Starting running project inside vm..."));
    const projectRunnerId =
      (await runProjectInsideVm(sealConfig, isDetached)) ?? 0;
    console.log(chalk.green(">> Project running inside vm"));

    // Update project status
    const json: IMetadata = {
      ...project,
      status: "up",
      sshProcessIds: sshPids,
      projectRunnerId: projectRunnerId,
    };
    await updateStore("projects", sealConfig.name, json);

    // Kill process on ctrl+c
    process.on("SIGINT", () => {
      (async () => {
        console.log(chalk.yellow(">> Killing process..."));
        await killMultipleProcesses([...sshPids, projectRunnerId]);
        await updateStore("projects", sealConfig.name, {
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
