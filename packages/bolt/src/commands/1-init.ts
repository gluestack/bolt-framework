import { Command } from "commander";
import Init from "../actions/init";
import { BOLT } from "../constants/bolt-configs";

export default async (program: Command) => {
  program
    .command("init")
    .option("-n, --name <name>", "Project name")
    .description(`Inits the project with ${BOLT.YAML_FILE_NAME} file`)
    .action(async (options) => {
      const init = new Init();
      await init.handle(options);
    });
};
