import { Command } from "commander";
import action from "../actions/env-generate";

export default async (program: Command) => {
  program
    .command("env:generate")
    .description(`Generates ".env" for all the services from ".env.tpl"`)
    .action(action);
};
