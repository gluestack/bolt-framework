import { Command } from "commander";
import action from "../actions/status";

export default async (program: Command) => {
  program
    .command("status")
    .argument("<project-path>", "Path to project")
    .description("Get the status of the sealvm")
    .action(action);
};
