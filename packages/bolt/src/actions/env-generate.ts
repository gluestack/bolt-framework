import { envToJson } from "@gluestack/helpers";
import { join } from "path";

import Common from "../common";

import { exists } from "../helpers/fs-exists";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";

import Env from "../libraries/env";

export default class EnvGenerate {
  public async handle({ build }: { build: "prod" | "dev" }): Promise<void> {
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
    for await (const [serviceName, service] of Object.entries(
      _yamlContent.services
    )) {
      const { servicePath } = await Common.getAndValidateService(
        serviceName,
        _yamlContent
      );

      const _envPath: string | boolean = await exists(
        join(servicePath, ".env.tpl")
      );
      let _envJson = {};
      if (typeof _envPath === "string") {
        _envJson = await envToJson(_envPath);
      }

      await env.addEnv(serviceName, _envJson, servicePath);
    }

    await env.generate();
  }
}
