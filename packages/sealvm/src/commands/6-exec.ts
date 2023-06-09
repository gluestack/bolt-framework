import { Command } from "commander";
import action from "../actions/exec";

export default async (program: Command) => {
  program
    .command("exec")
    .argument("<container-name>", "Name of the the container")
    .description("Gives the interactive shell for the container")
    .action(action);
};
