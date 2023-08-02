import { Command } from "commander";
import ServiceDown from "../actions/service-down";
import { BOLT } from "../constants/bolt-configs";

export default async (program: Command) => {
  program
    .command("service:down")
    .argument(
      "<service-name>",
      `service containing "${BOLT.SERVICE_YAML_FILE_NAME}" file and present in
      "${BOLT.YAML_FILE_NAME}" services`
    )
    .description(`Stops a service from "${BOLT.YAML_FILE_NAME}" services`)
    .action(async (serviceName: string) => {
      const serviceDown = new ServiceDown();
      await serviceDown.handle(serviceName);
    });
};
