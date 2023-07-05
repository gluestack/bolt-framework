import os from "os";
import chalk from "chalk";

import { execute } from "../helpers/execute";
import ServiceRunnerDocker from "../runners/service/docker";

export default class Ingress {
  public static async removeIfExist(containerName: string) {
    console.log(chalk.green(`>> Removing ${containerName} if exists...`));

    const args = ["rm", "-f", containerName, "2>/dev/null", "||", "true"];

    await execute("docker", args, {
      stdio: "inherit",
      shell: true,
    });
  }

  public static async start(
    containerName: string,
    ports: string[],
    volume: string,
    image: string
  ) {
    const opsys = os.platform();
    const addHost = opsys === "linux" ? ["--network", "host"] : null;

    const args: string[] = [
      "run",
      "-d",
      "--name",
      containerName,
      "-v",
      volume,
      "--rm",
    ];

    if (addHost) {
      args.push(...addHost);
    }

    if (ports.length > 0) {
      ports.forEach((port) => {
        args.push("-p");
        args.push(`${port}:${port}`);
      });
    }

    args.push(image);

    await Ingress.removeIfExist(containerName);

    console.log("Running docker", args.join(" "));

    await execute("docker", args, {
      stdio: "inherit",
      shell: true,
    });
  }

  public static async stop(containerName: string) {
    const docker = new ServiceRunnerDocker("", containerName, "", "", []);
    await docker.stopExec();
    await docker.remove();
  }
}
