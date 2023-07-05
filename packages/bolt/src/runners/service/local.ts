import { join } from "path";
import chalk from "chalk";
import { executeDetached } from "../../helpers/execute-detached";
import { killProcess } from "../../helpers/kill-process";
import { getLogs } from "../../helpers/get-local-logs";
import BoltServiceRunner from "../../typings/bolt-service-runner";
import { updateStore } from "../../helpers/update-store";
import { StoreService } from "../../typings/store-service";

export default class ServiceRunnerLocal implements BoltServiceRunner {
  volume: string;
  build: string;
  serviceName: string;

  constructor(serviceName: string, servicePath: string, build: string) {
    this.serviceName = serviceName;
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

  public async start() {
    const PID = await this.run(this.serviceName);

    const json: StoreService = {
      status: "up",
      serviceRunner: "local",
      projectRunner: "host",
      port: null,
      processId: PID,
    };
    await updateStore("services", this.serviceName, json);
  }

  public async stop(processId: number) {
    await killProcess(processId);

    const json: StoreService = {
      status: "down",
      serviceRunner: null,
      projectRunner: null,
      port: null,
      processId: null,
    };
    await updateStore("services", this.serviceName, json);
  }

  public async logs(isFollow: boolean) {
    await getLogs(this.serviceName, isFollow, join(".logs", this.serviceName));
  }
}
