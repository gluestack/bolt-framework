import { Command } from "commander";
import ServiceAdd from "../actions/service-add";
import { BOLT } from "../constants/bolt-configs";

export default async (program: Command) => {
  program
    .command("service:add")
    .argument("<service-name>", "name of the service")
    .argument(
      "<directory-path>",
      `directory path to the service, adds "${BOLT.SERVICE_YAML_FILE_NAME}" file`
    )
    .description(`Adds a service to "${BOLT.YAML_FILE_NAME}" services`)
    .action(async (serviceName, directoryPath) => {
      const serviceAdd = new ServiceAdd();
      await serviceAdd.handle(serviceName, directoryPath);
    });
};
