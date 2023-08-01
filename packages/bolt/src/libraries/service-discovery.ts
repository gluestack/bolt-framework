import { BoltService } from "../typings/bolt-service";
import * as net from "net";
import { exitWithMsg } from "../helpers/exit-with-msg";
import chalk from "chalk";
import { updateStoreRootData } from "../helpers/update-store";
import { getStoreData } from "../helpers/get-store-data";
import { envToJson } from "@gluestack/helpers";
import { join } from "path";

export default class ServiceDiscovery {
  serviceContent: BoltService;

  constructor(serviceContent: BoltService) {
    this.serviceContent = serviceContent;
  }

  isPortUsed(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();

      const onError = (e: any) => {
        socket.destroy();
        return resolve(false);
      };

      socket.once("error", onError);

      socket.connect(port, "localhost", () => {
        socket.end();
        return resolve(true);
      });
    });
  }

  async findAvailablePort(
    basePort: number,
    maxRetries: number
  ): Promise<number> {
    let port = basePort;
    let retries = 0;
    const storedPorts: string[] = (await getStoreData("ports")) || [];

    while (retries < maxRetries) {
      if (storedPorts.includes(port.toString())) {
        console.log(
          `>> ${chalk.yellow(
            port
          )} Port is already in use. Retrying with ${chalk.green(port + 1)}`
        );
        port++;
        continue;
      }

      const portInUse = await this.isPortUsed(port);

      if (!portInUse) {
        updateStoreRootData("ports", [...storedPorts, port.toString()]);
        return port;
      }

      console.log(
        `>> ${chalk.yellow(
          port
        )} Port is already in use. Retrying with ${chalk.green(port + 1)}`
      );
      port++;
      retries++;
    }
    await exitWithMsg(
      `Max retries (${maxRetries}) exceeded. Unable to find an available port.`
    );
    return 0;
  }

  public async discoverPort(serviceName?: string) {
    const ports = this.serviceContent.service_discovery_offset;
    const otherPorts = ports.slice(1);

    const assignedPort = await this.findAvailablePort(ports[0], 5);

    let otherAssignedPorts: number[] = [];
    for await (const port of otherPorts) {
      const currentAssignedPort = await this.findAvailablePort(port, 5);
      otherAssignedPorts.push(currentAssignedPort);
    }

    return [assignedPort, ...otherAssignedPorts];
  }

  public static async discoverProductionHost(servicePath: string) {
    const regex = /%(\w+)_ASSIGNED_HOST%/g;
    const envTplContent = await envToJson(join(servicePath, ".env.tpl"));
    let envContent: any = {};
    for await (const key of Object.keys(envTplContent)) {
      if (envTplContent[key].match(regex)) {
        envContent[`${key}`] = envTplContent[key].replace(
          regex,
          "{{$1_ASSIGNED_HOST}}"
        );
      }
    }
    return envContent;
  }
}
