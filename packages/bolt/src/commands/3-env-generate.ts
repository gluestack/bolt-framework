import { Command } from "commander";
import EnvGenerate from "../actions/env-generate";

export default async (program: Command) => {
  program
    .command("env:generate")
    .option("-b, --build <build>", "build type", "dev")
    .description(
      `Generates ".env" for all the services from ".env.tpl" file in each service`
    )
    .action(async (option) => {
      const envGenerate = new EnvGenerate();
      await envGenerate.handle(option);
    });
};
