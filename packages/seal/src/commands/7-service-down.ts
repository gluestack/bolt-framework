import { Command } from "commander";
import action from "../actions/service-down";

export default async (program: Command) => {
  program
    .command("service:down")
    .argument(
      "<service-name>",
      'service containing "seal.service.yaml" file and present in "seal.yaml" services',
    )
    .description(`Stops a service from "seal.yaml" services`)
    .action(action);
};
