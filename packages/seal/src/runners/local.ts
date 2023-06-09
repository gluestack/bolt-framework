import { join } from "path";
import chalk from "chalk";
import { executeDetached } from "../helpers/execute-detached";
import { killProcess } from "../helpers/kill-process";
import { getLocalLogs } from "../helpers/get-local-logs";

export default class Local {
  private volume: string;
  private build: string;

  constructor(servicePath: string, build: string) {
    this.build = build;
    this.volume = join(servicePath);
  }

  private async run() {
    const args: string[] = ["-c", `'${this.build}'`];

    this.printCommand(args);

    return executeDetached("sh", args, this.volume, {
      cwd: this.volume,
      shell: true,
    });
  }

  private async printCommand(args: string[]) {
    console.log(chalk.gray("$ sh", args.join(" ")));
  }

  static async start(servicePath: string, build: string) {
    const local: Local = new Local(servicePath, build);
    return await local.run();
  }

  static async stop(processId: number) {
    return await killProcess(processId);
  }

  static async logs(
    serviceName: string,
    servicePath: string,
    isFollow: boolean
  ) {
    await getLocalLogs(serviceName, servicePath, isFollow);
  }
}
