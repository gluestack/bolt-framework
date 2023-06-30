import { exec } from "child_process";
import { exitWithMsg } from "../helpers/exit-with-msg";
import util from "util";

export default class Doctor {
  private async run(command: string, args: string[]) {
    try {
      const execPromise = util.promisify(exec);
      const { stderr } = await execPromise(`${command} ${args.join(" ")}`);

      if (stderr) {
        await exitWithMsg(
          `${command} is not installed. Please install it and try again.`
        );
      }
    } catch (error: any) {
      if (error.stderr) {
        await exitWithMsg(
          `${command} is not installed. Please install it and try again.`
        );
      }
    }
  }

  public async handle(): Promise<void> {
    // Check if qemu-system-aarch64 is installed
    await this.run("qemu-system-aarch64", ["--version"]);

    // Check if fswatch is installed
    await this.run("fswatch", ["--version"]);

    // Check if rsync is installed
    await this.run("rsync", ["--version"]);
  }
}
