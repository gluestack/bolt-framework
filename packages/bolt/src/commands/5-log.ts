import { Command } from "commander";
import Log from "../actions/log";

export default async (program: Command) => {
  program
    .command("log")
    .argument("<service-name>", "name of the service")
    .option("-f, --follow", "follow logs")
    .option("--vm", "show logs of vm")
    .description(`Gives you the log of a service`)
    .action(async (serviceName, option) => {
      const log = new Log();
      await log.handle(serviceName, option);
    });
};
