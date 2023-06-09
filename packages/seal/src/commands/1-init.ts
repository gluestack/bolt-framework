import { Command } from "commander";
import action from "../actions/init";

export default async (program: Command) => {
  program
    .command("init")
    .description("Inits the project with seal")
    .action(action);
};
