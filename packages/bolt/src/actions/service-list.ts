import { ConsoleTable } from "@gluestack/helpers";
import { isEmpty } from "lodash";
import { join } from "path";
import { BOLT } from "../constants/bolt-configs";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { exists } from "../helpers/fs-exists";
import getStore from "../helpers/get-store";
import { parseYAML } from "../helpers/parse-yaml";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";
import { ProjectRunners, StoreServices } from "../typings/store-service";
import { validateBolt } from "../validations/bolt";

export default class List {
  public async handle() {
    const _yamlPath = join(BOLT.YAML_FILE_NAME);
    if (!(await exists(_yamlPath))) {
      await exitWithMsg(`>> "${_yamlPath}" doesn't exists`);
    }

    const _yamlContent = await validateBolt(await parseYAML(_yamlPath));
    if (
      !_yamlContent ||
      !_yamlContent.services ||
      isEmpty(_yamlContent.services)
    ) {
      await exitWithMsg(`>> "${BOLT.YAML_FILE_NAME}" services does not exists`);
    }

    // Validations for metadata and services
    await validateMetadata();
    await validateServices();

    const store = await getStore();
    const data: StoreServices = store.get("services") || [];
    let projectRunner = store.get("project_runner") || {};
    projectRunner = projectRunner === "none" ? "NA" : projectRunner;

    // Work from here
    if (!projectRunner) {
      await exitWithMsg(`>> Project runner not found`);
    }

    const head: string[] = [
      "#",
      "Service Name",
      "Status",
      "Project Runner",
      "Service Runner",
      "Port",
      "ProcessId",
    ];

    const rows: any = [];
    let counter = 0;
    Object.keys(data).forEach((key: any) => {
      if (!_yamlContent.services[key]) {
        return;
      }
      counter++;
      let port;
      if (data[key].port) {
        const portNumbers = data[key].port?.map(
          (port: any) => port.split(":")[0]
        );
        port = portNumbers?.join("\n");
      }
      rows.push([
        counter || "NA",
        key || "NA",
        data[key].status || "NA",
        projectRunner || "NA",
        data[key].serviceRunner || "NA",
        port || "NA",
        data[key].processId || "NA",
      ]);
    });

    ConsoleTable.print(head, rows);
  }
}
