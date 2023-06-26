import { Command } from "commander";
import action from "../actions/log";

export default async (program: Command) => {
  program
    .command("log")
    .argument("<project-path>", "Path to the project")
    .option("-f, --follow", "Follow the logs")
    .description("Get the status of the sealvm")
    .action(action);
};
