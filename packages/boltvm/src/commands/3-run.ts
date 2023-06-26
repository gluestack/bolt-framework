import { Command } from "commander";
import action from "../actions/run";

export default async (program: Command) => {
  program
    .command("start")
    .alias("run")
    .argument("<path>", "Path to the project")
    .option("-d, --detatch", "Runs the project in daemon mode")
    .description("Runs the project in the sealvm")
    .action(action);
};
