import { Command } from "commander";
import Up from "../actions/up";
import { BOLT } from "../constants/bolt-configs";

export default async (program: Command) => {
  program
    .command("up")
    .option("--host", "Runs the project on host")
    .option("--vm", "Runs the project on boltvm")
    .option("--cache", "Reuses the previously built container")
    .description(
      `Starts all the services mentioned in "${BOLT.YAML_FILE_NAME}" file`
    )
    .action(async (options) => {
      const up = new Up();
      await up.handle(options);
    });
};
