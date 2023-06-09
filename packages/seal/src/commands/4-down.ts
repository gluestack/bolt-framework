import { Command } from "commander";
import action from "../actions/down";

export default async (program: Command) => {
  program
    .command("down")
    .description(`Stops all the services from "seal.yaml" services`)
    .action(action);
};
