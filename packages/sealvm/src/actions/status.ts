import chalk from "chalk";
import { join } from "path";

import { validateSealFile } from "../helpers/validate-seal-file";
import { validateProjectStatus } from "../helpers/validate-project-status";

export default async function (localPath: string) {
  localPath =
    localPath === "." ? process.cwd() : join(process.cwd(), localPath);

  // Check for valid sealvm yml file
  const sealConfig = await validateSealFile(localPath);

  // Check if project has been created
  const project = await validateProjectStatus(sealConfig.name, "status");

  const status = project.status;

  switch (status) {
    case "build":
      console.log(
        chalk.green(`>> ${sealConfig.name}'s image has been build on sealvm. `)
      );
      break;
    case "up":
      console.log(
        chalk.green(`>> ${sealConfig.name} is up & running on sealvm. `)
      );
      break;
    case "down":
      console.log(chalk.green(`>> ${sealConfig.name} is down. `));
      break;
    default:
      console.log(
        chalk.green(`>> ${sealConfig.name} has unknown status. ${status} `)
      );
      break;
  }
}
