import { join } from "path";
import chalk from "chalk";
import { executeDetached } from "../../helpers/execute-detached";
import { killProcess } from "../../helpers/kill-process";
import { getLogs } from "../../helpers/get-local-logs";
import BoltServiceRunner from "../../typings/bolt-service-runner";

export default class ServiceRunnerLocal implements BoltServiceRunner {
  volume: string;
  build: string;

  constructor(servicePath: string, build: string) {
    this.build = build;
    this.volume = join(servicePath);
  }

  private async run(serviceName: string) {
    const args: string[] = ["-c", `'${this.build}'`];

    this.printCommand(args);

    return executeDetached(
      "sh",
      args,
      this.volume,
      {
        cwd: this.volume,
        shell: true,
      },
      serviceName
    );
  }

  private async printCommand(args: string[]) {
    console.log(chalk.gray("$ sh", args.join(" ")));
  }

  public async start(serviceName: string) {
    const PID = await this.run(serviceName);
    return PID;
  }

  public async stop(processId: number) {
    await killProcess(processId);
  }

  public async logs(isFollow: boolean, serviceName: string) {
    await getLogs(serviceName, isFollow, join(".logs", serviceName));
  }
}
