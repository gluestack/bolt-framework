import { join } from "path";
import { execute } from "../../helpers/execute";
import { exists } from "../../helpers/fs-exists";
import chalk from "chalk";
import BoltServiceRunner from "../../typings/bolt-service-runner";
import { StoreService } from "../../typings/store-service";
import { updateStore } from "../../helpers/update-store";

export default class ServiceRunnerDocker implements BoltServiceRunner {
  volume: string;
  container_name: string;
  build: string;
  envfile: string;
  ports: string[];
  volumes: string[];
  serviceName: string;

  constructor(
    serviceName: string,
    container_name: string,
    servicePath: string,
    build: string,
    ports: string[],
    envfile: string = "",
    volumes?: string[]
  ) {
    this.serviceName = serviceName;
    this.ports = ports;
    this.container_name = container_name;
    this.build = join(servicePath, build);
    this.volume = join(servicePath);
    this.envfile = envfile !== "" ? join(servicePath, envfile) : "";
    this.volumes = volumes || [];
  }

  private async create() {
    console.log(">> Creating Docker build...");
    const args: string[] = [
      "build",
      "--no-cache",
      "-t",
      this.container_name,
      "-f",
      this.build,
      this.volume,
    ];
    this.printCommand(args);
    await execute("docker", args, {
      cwd: this.volume,
      stdio: "inherit",
      shell: true,
    });
    console.log(">> Done with creating Docker build...");
  }

  private async run() {
    console.log(">> Initiaiting Docker run...");
    const args: string[] = [
      "run",
      "--rm",
      "--detach",
      "--name",
      this.container_name,
      "--hostname",
      this.container_name,
    ];
    if (this.envfile !== "" && (await exists(this.envfile))) {
      args.push("--env-file");
      args.push(this.envfile);
    }
    if (this.ports.length > 0) {
      this.ports.forEach((port) => {
        args.push("-p");
        args.push(port);
      });
    }
    if (this.volumes.length > 0) {
      this.volumes.forEach((volume) => {
        const v = volume.split(":")[1]
          ? `${join(process.cwd(), volume.split(":")[0])}:${
              volume.split(":")[1]
            }`
          : volume;
        args.push("-v");
        args.push(v);
      });
    }
    args.push(this.container_name);
    this.printCommand(args);
    await execute("docker", args, {
      cwd: this.volume,
      stdio: "inherit",
      shell: true,
    });

    console.log(">> Done with initiating Docker run...");
  }

  public async stopExec() {
    console.log(">> Stopping Docker Container...");

    const args: string[] = ["stop", this.container_name];

    this.printCommand(args);

    await execute("docker", args, {
      cwd: this.volume,
      stdio: "inherit",
      shell: true,
    });

    console.log(">> Done with stopping Docker Container...");
  }

  public async remove() {
    console.log(">> Removing Docker Container...");

    const args: string[] = ["rm", this.container_name];

    this.printCommand(args);

    await execute("docker", args, {
      cwd: this.volume,
      stdio: "inherit",
      shell: true,
    });

    console.log(">> Done with removing Docker Container...");
  }

  private async printCommand(args: string[]) {
    // console.log(chalk.gray("$ docker", args.join(" ")));
  }

  private async getLog(isFollow: boolean) {
    const args: string[] = isFollow
      ? ["logs", "--follow", this.container_name]
      : ["logs", this.container_name];

    this.printCommand(args);

    await execute("docker", args, {
      stdio: "inherit",
      shell: true,
    });
  }

  public async start() {
    await this.create();
    await this.run();

    const json: StoreService = {
      status: "up",
      serviceRunner: "docker",
      projectRunner: "host",
      port: this.ports,
      processId: this.container_name,
    };

    await updateStore("services", this.serviceName, json);
  }

  public async stop() {
    await this.stopExec();
    await this.remove();

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
    await this.getLog(isFollow);
  }
}
