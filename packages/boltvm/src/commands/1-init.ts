import { Command } from "commander";

export default async (program: Command) => {
  program
    .command("init")
    .argument("<file-path>", "local path to init")
    .description("Inits the project with sealvm")
    .action(() => {});
};
