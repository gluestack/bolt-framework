import { join } from "path";
import { execute } from "../helpers/execute";
import { exists } from "../helpers/fs-exists";
import chalk from "chalk";

export default class Docker {
  private volume: string;
  private container_name: string;
  private build: string;
  private envfile: string;
  private ports: string[];
  private volumes: string[];

  constructor(
    container_name: string,
    servicePath: string,
    build: string,
    ports: string[],
    envfile: string = "",
    volumes?: string[]
  ) {
    this.ports = ports;
    this.container_name = container_name;
    this.build = join(servicePath, build);
    this.volume = join(servicePath);
    this.envfile = envfile !== "" ? join(servicePath, envfile) : "";
    this.volumes = volumes || [];
  }

  private async create() {
    console.log("> Creating Docker Build...");

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

    console.log("> Done with Creating Docker Build...");
  }

  private async run() {
    console.log("> Initiaiting Docker Run...");

    const args: string[] = [
      "run",
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

    console.log("> Done with Initiating Docker Run...");
  }

  private async stopExec() {
    console.log("> Stopping Docker Container...");

    const args: string[] = ["stop", this.container_name];

    this.printCommand(args);

    await execute("docker", args, {
      cwd: this.volume,
      stdio: "inherit",
      shell: true,
    });

    console.log("> Done with Stopping Docker Container...");
  }

  private async remove() {
    console.log("> Removing Docker Container...");

    const args: string[] = ["rm", this.container_name];

    this.printCommand(args);

    await execute("docker", args, {
      cwd: this.volume,
      stdio: "inherit",
      shell: true,
    });

    console.log("> Done with Removing Docker Container...");
  }

  private async printCommand(args: string[]) {
    console.log(chalk.gray("$ docker", args.join(" ")));
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

  static async start(
    container_name: string,
    servicePath: string,
    build: string,
    ports: string[],
    envfile: string = "",
    volumes?: string[]
  ) {
    const docker: Docker = new Docker(
      container_name,
      servicePath,
      build,
      ports,
      envfile,
      volumes
    );

    await docker.create();
    await docker.run();
  }

  static async stop(
    container_name: string,
    servicePath: string,
    build: string,
    ports: string[] = [],
    envfile: string = ""
  ) {
    const docker: Docker = new Docker(
      container_name,
      servicePath,
      build,
      ports,
      envfile
    );

    await docker.stopExec();
    await docker.remove();
  }

  static async logs(
    container_name: string,
    servicePath: string,
    build: string,
    ports: string[] = [],
    envfile: string = "",
    isFollow: boolean
  ) {
    const docker: Docker = new Docker(
      container_name,
      servicePath,
      build,
      ports,
      envfile
    );

    await docker.getLog(isFollow);
  }
}
