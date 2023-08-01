import chalk from "chalk";
import Common from "../common";
import { execute } from "../helpers/execute";

import generateRoutes from "../helpers/generate-routes";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";

export default class RouteGenerate {
  public async handle(options: any) {
    const _yamlContent = await Common.getAndValidateBoltYaml();

    const isProd = options.prod || false;

    if (isProd) {
      console.log(chalk.gray(">> Building Production Envs..."));
      const args = ["env:generate", "--build", "prod"];
      await execute("bolt", args, {});
    }

    // Validations for metadata and services
    await validateMetadata();
    await validateServices();

    console.log(`>> Creating Ingress...`);
    await generateRoutes(_yamlContent, isProd);
    process.exit(0);
  }
}
