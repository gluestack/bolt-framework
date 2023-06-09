import { join } from "path";
import * as yaml from "yaml";
import { execute } from "../helpers/execute";
import { removeSpecialChars, writeFile, fileExists } from "@gluestack/helpers";
import {
  IDockerCompose,
  IHealthCheck,
  IService,
} from "../typings/docker-compose";
import chalk from "chalk";
import { SealServicePlatform } from "../typings/seal-service";

/**
 * Docker Compose
 *
 * This class is responsible for generating the seal.compose.yml file
 */
export default class DockerCompose implements IDockerCompose {
  public version: string = "3.9";
  public services: { [key: string]: IService };

  constructor() {
    this.services = {};
  }

  // Converts the docker-compose json data to YAML
  public toYAML() {
    return yaml.stringify({
      version: this.version,
      services: this.services,
    });
  }

  // Adds a service to the docker-compose file
  public pushToService(name: string, service: IService) {
    this.services[removeSpecialChars(name)] = service;
  }

  // Generates the docker-compose file
  public async generate() {
    const directory: string = process.cwd();

    await writeFile(join(directory, "seal.compose.yml"), this.toYAML());
  }

  // Adds the service to the docker-compose file
  public async addService(
    projectName: string,
    serviceName: string,
    path: string,
    content?: SealServicePlatform,
  ) {
    if (!(await fileExists(join(path, content?.build || "")))) {
      return;
    }

    serviceName = removeSpecialChars(serviceName);
    const bindingPath: string = join(path, "..");
    const service: IService = {
      container_name: serviceName,
      restart: "always",
      build: {
        context: path,
        dockerfile: join(path, content?.build || ""),
      },
    };

    if (await fileExists(join(path, ".env"))) {
      service.env_file = [join(path, ".env")];
    }
    if (content?.healthcheck) {
      service.healthcheck = content?.healthcheck;
    }
    if (content?.depends_on) {
      service.depends_on = content?.depends_on;
    }
    if (content?.ports) {
      service.ports = content?.ports;
    }
    if (content?.volumes) {
      service.volumes = content?.volumes.map((volume) => {
        return volume.split(":")[1]
          ? `${join(process.cwd(), volume.split(":")[0])}:${
              volume.split(":")[1]
            }`
          : volume;
      });
    }

    this.pushToService(serviceName, service);
  }

  // Adds the nginx service to the docker-compose file
  public async addNginx(ports?: string[]) {
    if (!(await fileExists(join(process.cwd(), "seal.nginx.conf")))) {
      return;
    }

    // mapped all the subdomain ports with the nginx container
    const nginx: IService = {
      container_name: "nginx",
      restart: "always",
      build: join(__dirname, "..", "templates", "nginx"),
      volumes: [
        `${join(process.cwd(), "seal.nginx.conf")}:/etc/nginx/nginx.conf`,
      ],
    };

    if (ports) {
      nginx.ports = ports.map((port) => `${port}:${port}`);
    }

    this.pushToService("nginx", nginx);
  }

  // Executes the docker-compose up cli
  public async start(projectName: string, filepath: string) {
    const args: string[] = [
      "compose",
      "-p",
      projectName,
      "-f",
      "seal.compose.yml",
      "up",
      "--remove-orphans",
      "-d",
    ];

    this.printCommand(args);

    await execute("docker", args, {
      cwd: join(filepath),
      stdio: "inherit",
      shell: true,
    });
  }

  // Executes the docker-compose down cli
  public async stop(projectName: string, filepath: string) {
    const args: string[] = [
      "compose",
      "-p",
      projectName,
      "-f",
      "seal.compose.yml",
      "down",
      "--volumes",
    ];

    this.printCommand(args);

    await execute("docker", args, {
      cwd: filepath,
      stdio: "inherit",
      shell: true,
    });
  }

  private async printCommand(args: string[]) {
    console.log(chalk.gray("$ docker", args.join(" ")));
  }
}
