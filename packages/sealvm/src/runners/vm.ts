import chalk from "chalk";
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
      this.projectPath,
      {
        shell: true,
      }
    );
  }

  static async connect() {
    console.log(chalk.yellow(">> initiating connection..."));
    const conn: any = await connecToVm();
    if (conn) {
      console.log(chalk.green(">> connection established... \n"));
      return conn;
    }
  }

  static async connectOnce() {
    console.log(chalk.yellow(">> initiating connection..."));
    const conn: any = await connectToVmOnce();
    console.log(chalk.green(">> connection established... \n"));
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
