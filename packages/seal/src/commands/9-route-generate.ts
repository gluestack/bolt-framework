import { Command } from "commander";
import action from "../actions/route-generate";

export default async (program: Command) => {
  program
    .command("route:generate")
    .description(`Generates "seal.nginx.conf" file against "seal.yaml" ingress`)
    .action(action);
};
