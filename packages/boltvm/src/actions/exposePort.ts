import chalk from "chalk";

import { SSH_CONFIG } from "../constants/bolt-vm";

import { executeDetached } from "../helpers/execute-detached";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { exists } from "../helpers/fs-exists";
import { updateStore } from "../helpers/update-store";
import { validateBoltYaml } from "../helpers/validate-bolt-file";
import { validateProjectStatus } from "../helpers/validate-project-status";

import { IMetadata } from "../typings/metadata";

export default class ExposePort {
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
    console.log(chalk.green(`>> Port ${port} exposed!`));
    return sshPid;
  }

  public async handle(localPath: string, ports: string[]) {
    try {
      // Check for file path exists or not
      if (!(await exists(localPath))) {
        await exitWithMsg(">> Invalid File Path");
        return;
      }

      // Check for valid boltvm yml file
      const boltConfig = await validateBoltYaml(localPath);

      const { project_id } = boltConfig;

      const project = await validateProjectStatus("exec", boltConfig);

      const vmPort = project.sshPort as number;

      const portExposePromises: any = [];
      for (const port of ports) {
        portExposePromises.push(this.exposePort(vmPort, port));
      }

      const sshPids: number[] | null[] = await Promise.all(portExposePromises);

      if (!project.sshProcessIds) {
        project.sshProcessIds = [];
      }

      const json: IMetadata = {
        ...project,
        sshProcessIds: sshPids,
      };

      await updateStore("projects", project_id, json);
    } catch (error: any) {
      await exitWithMsg(
        `>> Some Error occured while exposing port: ${error.message}`
      );
    }
  }
}
