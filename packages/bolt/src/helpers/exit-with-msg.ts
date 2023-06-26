import chalk from "chalk";

export const exitWithMsg = async (
  msg: unknown,
  code: number = -1,
): Promise<void> => {
  console.log(chalk.redBright(msg));
  process.exit(code);
};
