import { ConsoleTable } from "@gluestack/helpers";

import Common from "../common";

import { exitWithMsg } from "../helpers/exit-with-msg";
import { validateMetadata } from "../helpers/validate-metadata";
import { validateServices } from "../helpers/validate-services";
import { Ingress, Option } from "../typings/ingress";

export default class RouteList {
  public async handle() {
    const _yamlContent = await Common.getAndValidateBoltYaml();

    // Validations for metadata and services
    await validateMetadata();
    await validateServices();

    if (!_yamlContent.ingress || _yamlContent.ingress.length === 0) {
      return exitWithMsg(
        ">> No ingress found in config. Skipping route generation..."
      );
    }

    const rows = [] as Array<Array<string>>;
    const head: Array<string> = [
      "Domain",
      "Port",
      "Location",
      "Proxy Pass",
      "Rewrite Key",
      "Rewrite Value",
      "Client MaxBody (in MB)",
    ];

    _yamlContent.ingress.forEach((ingress: Ingress) => {
      const domain = ingress.domain || undefined;
      const port = ingress.port || undefined;
      if (!domain || !port) {
        console.log(">> No domain or port found in config");
        return;
      }

      ingress.options.forEach((option: Option) => {
        const { location, rewrite_key, rewrite_value, proxy_pass } = option;

        if (!location || !rewrite_key || !rewrite_value || !proxy_pass) {
          console.log(">> Missing required option in ingress config");
          return;
        }

        const client_max_body_size = option.client_max_body_size || 50;

        rows.push([
          domain,
          `${port}`,
          location,
          proxy_pass,
          rewrite_key,
          rewrite_value,
          `${client_max_body_size}`,
        ]);
      });
    });

    await ConsoleTable.print(head, rows);
  }
}
