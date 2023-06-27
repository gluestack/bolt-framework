import { Command } from "commander";
import Exec from "../actions/exec";

export default async (program: Command) => {
  program
    .command("exec")
    .description(`Opens up the VM shell for the project running in the VM`)
    .action(async () => {
      const exec = new Exec();
      await exec.handle();
    });
};
