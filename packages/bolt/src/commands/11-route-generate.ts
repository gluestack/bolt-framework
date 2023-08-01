import { Command } from "commander";
import RouteGenerate from "../actions/route-generate";
import { BOLT } from "../constants/bolt-configs";

export default async (program: Command) => {
  program
    .command("route:generate")
    .option("-p, --prod", "generates routes for deployment")
    .description(
      `Generates "${BOLT.NGINX_CONFIG_FILE_NAME}" file against "${BOLT.YAML_FILE_NAME}" ingress`
    )
    .action(async (options) => {
      const routeGenerate = new RouteGenerate();
      await routeGenerate.handle(options);
    });
};
