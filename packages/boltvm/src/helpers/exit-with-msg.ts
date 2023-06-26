import chalk from "chalk";

export const exitWithMsg = (
  msg: unknown,
  code: number = -1,
): void => {
  console.log(chalk.redBright(msg));
  process.exit(code);
};
