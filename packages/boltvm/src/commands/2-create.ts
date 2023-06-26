import { Command } from "commander";
import action from "../actions/create";

export default async (program: Command) => {
  program
    .command("create")
    .argument("<path>", "path to the project")
    .description("Creates the project inside sealvm")
    .action(action);
};
