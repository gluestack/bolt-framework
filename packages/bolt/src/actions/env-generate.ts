import { envToJson, jsonToEnv } from "@gluestack/helpers";
import { join } from "path";

import { writefile } from "../helpers/fs-writefile";

import Env from "../libraries/env";
import ServiceDiscovery from "../libraries/service-discovery";
import Common from "../common";

import PortDiscovery from "./port-discovery";
import { Ingress } from "../typings/ingress";

type ServiceInfo = {
  ports: any;
  serviceName: string;
  servicePath: string;
  ingress: Ingress[] | null | undefined;
};

interface IHandlerFunctionArgs {
  environment: "local" | "production";
  serviceInfo?: ServiceInfo;
}

export default class EnvGenerate {
  public async handle({
    environment,
    serviceInfo,
  }: IHandlerFunctionArgs): Promise<void> {
    switch (environment) {
      case "local":
        await this.local(serviceInfo as ServiceInfo);
        break;
      case "production":
        await this.production();
        break;
    }
    return;
  }

  public async local(serviceInfo: ServiceInfo): Promise<void> {
    // Gathering all contants
    const { servicePath, serviceName } = serviceInfo;
    const _yamlContent = await Common.getAndValidateBoltYaml();
    const ingress = _yamlContent.ingress || [];

    const env = new Env(
      await envToJson(join(process.cwd(), ".env.tpl")),
      ingress
    );

    // Reading the .env.tpl
    let serviceEnvJSON = await envToJson(join(servicePath, ".env.tpl"));

    // Adding assigned ports and assigned hosts to the .env.tpl
    let envTplContent = jsonToEnv({
      ...serviceEnvJSON,
      ["ASSIGNED_HOST"]: "localhost",
      ...(serviceInfo.ports || {}),
    });

    // Writing the updated .env.tpl
    await writefile(join(servicePath, ".env.tpl"), envTplContent);

    // Reading values from updated .env.tpl and generating env from that
    serviceEnvJSON = await envToJson(join(servicePath, ".env.tpl"));

    await env.addEnv(serviceName, serviceEnvJSON, servicePath);

    await env.generate();
  }

  public async production() {
    const _yamlContent = await Common.getAndValidateBoltYaml();

    const ingress = _yamlContent.ingress || [];

    const env = new Env(
      await envToJson(join(process.cwd(), ".env.tpl")),
      ingress,
      true
    );

    // Gather all the availables services
    for await (const [serviceName] of Object.entries(_yamlContent.services)) {
      const { servicePath, content } = await Common.getAndValidateService(
        serviceName,
        _yamlContent
      );

      let serviceEnvJSON = await envToJson(join(servicePath, ".env.tpl"));
      const defaultEnv = {
        ...serviceEnvJSON,
        ["ASSIGNED_HOST"]: "localhost",
      };
      const portDiscovery = new PortDiscovery(content);
      const productionPorts = await portDiscovery.production();
      let envContent = jsonToEnv({
        ...defaultEnv,
        ...(productionPorts.ports || {}),
      });
      await writefile(join(servicePath, ".env.tpl"), envContent);
      serviceEnvJSON = await envToJson(join(servicePath, ".env.tpl"));
      const productionHosts = await ServiceDiscovery.discoverProductionHost(
        servicePath
      );
      serviceEnvJSON = {
        ...serviceEnvJSON,
        ...productionHosts,
      };
      await env.addEnv(serviceName, serviceEnvJSON, servicePath);
    }
    await env.generate();
  }
}
