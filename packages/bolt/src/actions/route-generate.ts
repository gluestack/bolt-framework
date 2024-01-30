import Common from "../common";

import generateRoutes from "../helpers/generate-routes";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";

export default class RouteGenerate {
  public async handle(isProd: boolean = false) {
    const _yamlContent = await Common.getAndValidateBoltYaml();

    // Validations for metadata and services
    await validateMetadata();
    await validateServices();

    console.log(`>> Creating Ingress...`);
    await generateRoutes(_yamlContent, isProd);
    process.exit(0);
  }
}
