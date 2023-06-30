import chalk from "chalk";
import { join } from "path";

import { BOLTVM } from "../constants/bolt-vm";
import { VM_BOOT } from "../constants/vm-commands";

import { connecToVm, connectToVmOnce } from "../helpers/connect-to-vm";
import { executeDetachedWithLogs } from "../helpers/execute-detached";
import { killProcess } from "../helpers/kill-process";

export default class Vm {
  private projectPath: string;
  private containerPath: string;
  private sshPort: number;

  constructor(projectPath: string, containerPath: string, sshPort: number) {
    this.projectPath = projectPath;
    this.containerPath = containerPath;
    this.sshPort = sshPort;
  }

  private async boot() {
    const args: string[] = VM_BOOT(this.containerPath, this.sshPort);
    return executeDetachedWithLogs(
      "qemu-system-aarch64",
      args,
      join(this.projectPath, BOLTVM.LOG_FOLDER),
      {
        shell: true,
      }
    );
  }

  static async connect(portNumber: number = 2222) {
    console.log(chalk.yellow(">> Initiating connection..."));
    const conn: any = await connecToVm(portNumber);
    console.log(chalk.green(">> Connection established..."));
    return conn;
  }

  static async connectOnce(portNumber: number = 2222) {
    console.log(chalk.yellow(">> Initiating connection..."));
    const conn: any = await connectToVmOnce(portNumber);
    console.log(chalk.green(">> Connection established..."));
    return conn;
  }

  static async create(
    projectPath: string,
    containerPath: string,
    sshPort: number
  ): Promise<number> {
    const vm = new Vm(projectPath, containerPath, sshPort);
    return await vm.boot();
  }

  static async destroy(processId: number) {
    await killProcess(processId);
  }
}
