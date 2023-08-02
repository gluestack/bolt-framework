import { Command } from "commander";
import RouteList from "../actions/route-list";
import { BOLT } from "../constants/bolt-configs";

export default async (program: Command) => {
  program
    .command("route:list")
    .description(
      `List routes generated using "${BOLT.YAML_FILE_NAME}" file's ingress object`
    )
    .action(async () => {
      const routeList = new RouteList();
      await routeList.handle();
    });
};
