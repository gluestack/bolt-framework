import chalk from "chalk";
import { join } from "path";
import { execute } from "./execute";
import { exists } from "./fs-exists";

export const getLogs = async (
  serviceName: string,
  servicePath: string,
  isFollow: boolean,
  filePath: string
): Promise<void> => {
  //check if log file exists in the service or not
  const serviceLogPath = filePath;

  if (!(await exists(serviceLogPath))) {
    console.log(
      chalk.red(`>> No .logs folder found in the service: ${serviceName}`)
    );
    return;
  }

  const outputLogPath = join(serviceLogPath, "out.log");
  const errorLogPath = join(serviceLogPath, "err.log");

  if (!(await exists(outputLogPath))) {
    console.log(chalk.red(`>> out.logs file not found for ${serviceName}`));
    return;
  }

  if (!(await exists(errorLogPath))) {
    console.log(chalk.red(`>> err.logs file not found for ${serviceName}`));
    return;
  }

  const catLogsCommand = `cat  ${join(serviceLogPath, "*.log")}`;
  const tailLogsCommand = `tail -f ${join(serviceLogPath, "*.log")}`;

  const executableCommand = isFollow ? tailLogsCommand : catLogsCommand;

  console.log(chalk.gray(`$ ${executableCommand}`));

  const args: string[] = ["-c", `'${executableCommand}'`];

  await execute("sh", args, {
    stdio: "inherit",
    shell: true,
  });
};
