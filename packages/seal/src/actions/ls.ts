import { join } from "path";

import { exists } from "../helpers/fs-exists";
import { parseYAML } from "../helpers/parse-yaml";
import { exitWithMsg } from "../helpers/exit-with-msg";

import { isEmpty } from "lodash";
import { validateSeal } from "../validations/seal";
import { Seal } from "../typings/seal";

import { ConsoleTable } from "@gluestack/helpers";
import getStore from "../helpers/get-store";

export default async (): Promise<void> => {
  const _yamlPath = join("seal.yaml");
  if (!(await exists(_yamlPath))) {
    await exitWithMsg(`> "${_yamlPath}" doesn't exists`);
  }

  const _yamlContent: Seal = await validateSeal(await parseYAML(_yamlPath));
  if (
    !_yamlContent ||
    !_yamlContent.services ||
    isEmpty(_yamlContent.services)
  ) {
    await exitWithMsg(`> "seal.yaml" services does not exists`);
  }

  const store = await getStore();
  const data: any = store.get("services") || [];

  const head: string[] = [
    "#",
    "Service Name",
    "Status",
    "Platform",
    "Port",
    "ProcessId",
  ];

  const rows: any = [];
  let counter = 0;
  Object.keys(data).forEach((key: any) => {
    if (_yamlContent.services[key]) {
      counter++;
      let port;
      if (data[key].port) {
        const portNumbers = data[key].port.map(
          (port: any) => port.split(":")[0]
        );
        port = portNumbers?.join("\n");
      }

      rows.push([
        counter || "NA",
        key || "NA",
        data[key].status || "NA",
        data[key].platform || "NA",
        port || "NA",
        data[key].processId || "NA",
      ]);
    }
  });

  ConsoleTable.print(head, rows);
};
