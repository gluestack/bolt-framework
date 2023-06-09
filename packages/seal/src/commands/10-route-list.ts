import { Command } from "commander";
import action from "../actions/route-list";

export default async (program: Command) => {
  program
    .command("route:list")
    .description(`List routes from the "seal.yaml" ingress`)
    .action(action);
};
