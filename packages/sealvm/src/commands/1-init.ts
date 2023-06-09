import { Command } from "commander";
import action from "../actions/init";

export default async (program: Command) => {
  program
    .command("init")
    .argument("<file-path>", "local path to init")
    .description("Inits the project with sealvm")
    .action(action);
};
