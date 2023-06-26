import { Command } from "commander";
import RouteGenerate from "../actions/route-generate";
import { BOLT } from "../constants/bolt-configs";

export default async (program: Command) => {
  program
    .command("route:generate")
    .description(
      `Generates "${BOLT.NGINX_CONFIG_FILE_NAME}" file against "${BOLT.YAML_FILE_NAME}" ingress`
    )
    .action(async () => {
      const routeGenerate = new RouteGenerate();
      await routeGenerate.handle();
    });
};
