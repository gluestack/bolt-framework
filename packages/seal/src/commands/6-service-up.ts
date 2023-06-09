import { Command, Option } from "commander";
import action from "../actions/service-up";

export default async (program: Command) => {
  const platformOption: Option = new Option(
    "-p, --platform <platform>",
    "platform name to run the service on",
  ).choices(["docker", "local"])

  program
    .command("service:up")
    .argument(
      "<service-name>",
      'service containing "seal.service.yaml" file and present in "seal.yaml" services',
    )
    .addOption(platformOption.makeOptionMandatory())
    .description(`Starts a service from "seal.yaml" services`)
    .action(action);
};
