import { join } from "path";
import Env from "../libraries/env";
import { Seal } from "../typings/seal";
import { getAndValidateSealYaml } from "./up";
import { exists } from "../helpers/fs-exists";
import { envToJson } from "@gluestack/helpers";
import { getAndValidateService } from "./service-up";

export default async ({build}: {build: "prod" | "dev"}): Promise<void> => {
  
  const _yamlContent: Seal = await getAndValidateSealYaml();

  const ingress = _yamlContent.ingress || [];

  const env = new Env(await envToJson(join(process.cwd(), ".env.tpl")), build, ingress);
 // Gather all the availables services
  for await (const [serviceName, service] of Object.entries(
    _yamlContent.services,
  )) {
    const { servicePath, _serviceYamlPath, _ymlPath, yamlPath, content } =
      await getAndValidateService(serviceName, _yamlContent);

    const _envPath: string | boolean = await exists(
        join(servicePath, ".env.tpl"),
    );
    let _envJson = {}
    if (typeof _envPath === "string") {
        _envJson = await envToJson(_envPath);
    }

    await env.addEnv(
      serviceName,
      _envJson,
      servicePath
    );
  }

  await env.generate();
};
