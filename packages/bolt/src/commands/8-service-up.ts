import { Command, Option } from "commander";
import ServiceUp from "../actions/service-up";
import { BOLT } from "../constants/bolt-configs";

export default async (program: Command) => {
  const platformOption: Option = new Option(
    "-sr, --service-runner <service-runner>",
    "service runner to run the service on"
  ).choices(["docker", "local"]);

  program
    .command("service:up")
    .argument(
      "<service-name>",
      `service containing "${BOLT.SERVICE_YAML_FILE_NAME}" file and present in "${BOLT.YAML_FILE_NAME}" services`
    )
    .addOption(platformOption.makeOptionMandatory())
    .description(`Starts a service from ${BOLT.YAML_FILE_NAME} services`)
    .action(async (serviceName: string, options: any) => {
      const serviceUp = new ServiceUp();
      serviceUp.handle(serviceName, options);
    });
};
