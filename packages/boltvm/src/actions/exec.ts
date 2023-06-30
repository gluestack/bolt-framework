import chalk from "chalk";
import { SSH_CONFIG } from "../constants/bolt-vm";
import { execute } from "../helpers/execute";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { validateProjectStatus } from "../helpers/validate-project-status";
import { validateBoltYaml } from "../helpers/validate-bolt-file";
import { exists } from "../helpers/fs-exists";

export default class Exec {
  public async handle(localPath: string) {
    try {
      // Check for file path exists or not
      if (!(await exists(localPath))) {
        exitWithMsg(">> Please specify correct path in source!");
        return;
      }
      const boltConfig = await validateBoltYaml(localPath);

      const project = await validateProjectStatus("exec", boltConfig);
      const sshPort = project?.sshPort;
      if (!sshPort) {
        exitWithMsg(">> Unable to find ssh port for the container!");
      }
      if (project && sshPort) {
        console.log(chalk.yellow(`>> Opening shell...`));

        const args = ["-p", sshPort.toString(), ...SSH_CONFIG];
        await execute("ssh", args, {
          stdio: "inherit",
          shell: true,
        });
      }
    } catch (error: any) {
      exitWithMsg(`>> Unable to open shell!, ${error.message}`);
    }
  }
}
