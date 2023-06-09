import { Command } from "commander";
import action from "../actions/log";

export default async (program: Command) => {
  program
    .command("log")
    .argument("<service-name>", "name of the service")
    .option("-f, --follow", "follow logs")
    .description(`Gives logs of the service`)
    .action(action);
};
