import { Command } from "commander";
import action from "../actions/service-add";

export default async (program: Command) => {
  program
    .command("service:add")
    .argument("<service-name>", "name of the service")
    .argument(
      "<directory-path>",
      'directory path to the service, adds "seal.service.yaml" file',
    )
    .description(`Adds a service to "seal.yaml" services`)
    .action(action);
};
