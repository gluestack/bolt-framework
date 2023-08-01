import ServiceDiscovery from "../libraries/service-discovery";
import { BoltService } from "../typings/bolt-service";

export default class PortDiscovery {
  serviceContent: BoltService;

  constructor(serviceContent: BoltService) {
    this.serviceContent = serviceContent;
  }

  public async handle() {
    const serviceDiscovery = new ServiceDiscovery(this.serviceContent);
    const ports = await serviceDiscovery.discoverPort();
    this.serviceContent.service_discovery_offset = ports;

    const portEnvTplJson: any = {};

    ports.forEach((port: number, index: number) => {
      if (!index) {
        portEnvTplJson["ASSIGNED_PORT"] = `${port}`;
        return;
      }
      portEnvTplJson[`ASSIGNED_PORT_${index}`] = `${port}`;
      return;
    });

    return {
      ports: portEnvTplJson,
      serviceName: this.serviceContent.container_name,
    };
  }

  public async production() {
    const portEnvTplJson: any = {};

    for (const [
      index,
      port,
    ] of this.serviceContent.service_discovery_offset.entries()) {
      if (!index) {
        portEnvTplJson["ASSIGNED_PORT"] = `${port}`;
        continue;
      }
      portEnvTplJson[`ASSIGNED_PORT_${index}`] = `${port}`;
    }

    return {
      ports: portEnvTplJson,
      serviceName: this.serviceContent.container_name,
    };
  }
}
