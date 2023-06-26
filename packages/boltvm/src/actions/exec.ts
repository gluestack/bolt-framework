import chalk from "chalk";
import { SSH_CONFIG } from "../constants";
import { execute } from "../helpers/execute";
import { exitWithMsg } from "../helpers/exit-with-msg";
import { validateProjectStatus } from "../helpers/validate-project-status";
import { validateSealFile } from "../helpers/validate-seal-file";

export default async function (localPath: string) {
  const sealvmConfig = await validateSealFile(localPath);
  const project = await validateProjectStatus(
    sealvmConfig.projectId,
    "exec",
    sealvmConfig
  );
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
}
