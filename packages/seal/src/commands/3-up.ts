import { Command } from "commander";
import action from "../actions/up";

export default async (program: Command) => {
  program
    .command("up")
    .description(`Starts all the services from "seal.yaml" services`)
    .action(action);
};
