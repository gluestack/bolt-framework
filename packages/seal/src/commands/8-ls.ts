import { Command } from "commander";
import action from "../actions/ls";

export default async (program: Command) => {
  program
    .command("ls")
    .description(`Lists all services from "seal.yaml" services`)
    .action(action);
};
