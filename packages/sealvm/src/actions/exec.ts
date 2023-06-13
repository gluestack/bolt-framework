import chalk from "chalk";
import { SSH_CONFIG } from "../constants";
import { execute } from "../helpers/execute";
import { validateProjectStatus } from "../helpers/validate-project-status";

export default async function (containerName: string) {
  const project = await validateProjectStatus(containerName, "exec");
  const sshPort = project?.sshPort;

  if (project && sshPort) {
    console.log(chalk.yellow(`Opening shell for ${containerName}...`));

    const args = ["-p", sshPort.toString(), ...SSH_CONFIG];
    await execute("ssh", args, {
      stdio: "inherit",
      shell: true,
    });
  }
}
