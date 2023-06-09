import { Command } from "commander";
import action from "../actions/down";

export default async (program: Command) => {
  program
    .command("down")
    .argument("<project-path>", "Path to project")
    .description("Stops the project running inside sealvm")
    .action(action);
};
