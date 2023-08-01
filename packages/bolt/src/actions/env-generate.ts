import { envToJson, jsonToEnv } from "@gluestack/helpers";
import { join } from "path";

import Common from "../common";

import { writefile } from "../helpers/fs-writefile";
import { getOs } from "../helpers/get-os";
import { rewriteEnvViaRegExpression } from "../helpers/rewrite-env";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";

import Env from "../libraries/env";
import ServiceDiscovery from "../libraries/service-discovery";
import PortDiscovery from "./port-discovery";

export default class EnvGenerate {
  public async handle({
    build,
    discoveredPorts,
  }: {
    build: "prod" | "dev";
    discoveredPorts?: {
      ports: any;
      serviceName: String;
    };
  }): Promise<void> {
    const _yamlContent = await Common.getAndValidateBoltYaml();

    // Validations for metadata and services
    await validateMetadata();
    await validateServices();

    const ingress = _yamlContent.ingress || [];

    const env = new Env(
      await envToJson(join(process.cwd(), ".env.tpl")),
      build,
      ingress
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

      let envContent = jsonToEnv({
        ...defaultEnv,
      });

      if (discoveredPorts?.serviceName === serviceName) {
        envContent = jsonToEnv({
          ...defaultEnv,
          ...(discoveredPorts.ports || {}),
        });
      }

      if (build === "prod") {
        const portDiscovery = new PortDiscovery(content);
        const productionPorts = await portDiscovery.production();

        envContent = jsonToEnv({
          ...defaultEnv,
          ...(productionPorts.ports || {}),
        });
      }

      await writefile(join(servicePath, ".env.tpl"), envContent);

      serviceEnvJSON = await envToJson(join(servicePath, ".env.tpl"));

      if (build === "prod") {
        const productionHosts = await ServiceDiscovery.discoverProductionHost(
          servicePath
        );
        serviceEnvJSON = {
          ...serviceEnvJSON,
          ...productionHosts,
        };
      }

      await env.addEnv(serviceName, serviceEnvJSON, servicePath);
    }
    await env.generate();
  }
}
