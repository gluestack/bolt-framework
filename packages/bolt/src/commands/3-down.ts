import { Command } from "commander";
import Down from "../actions/down";
import { BOLT } from "../constants/bolt-configs";

export default async (program: Command) => {
  program
    .command("down")
    .description(
      `Stops all the services mentioned in "${BOLT.YAML_FILE_NAME}" file`
    )
    .action(async () => {
      const down = new Down();
      await down.handle();
    });
};
