import { Command } from "commander";
import List from "../actions/service-list";
import { BOLT } from "../constants/bolt-configs";

export default async (program: Command) => {
  program
    .command("service:list")
    .description(`Lists all services from "${BOLT.YAML_FILE_NAME}" services`)
    .action(async () => {
      const list = new List();
      await list.handle();
    });
};
