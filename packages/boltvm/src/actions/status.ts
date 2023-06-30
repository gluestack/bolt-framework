import chalk from "chalk";
import { join } from "path";
import { exitWithMsg } from "../helpers/exit-with-msg";

import { validateBoltYaml } from "../helpers/validate-bolt-file";
import { validateProjectStatus } from "../helpers/validate-project-status";

export default class Status {
  public async handle(localPath: string) {
    try {
      localPath =
        localPath === "." ? process.cwd() : join(process.cwd(), localPath);

      // Check for valid boltvm yml file
      const boltConfig = await validateBoltYaml(localPath);

      const { project_name } = boltConfig;

      // Check if project has been created
      const project = await validateProjectStatus("status", boltConfig);

      const status = project.status;

      switch (status) {
        case "build":
          console.log(
            chalk.green(`>> ${project_name}'s image has been build on boltvm. `)
          );
          break;
        case "up":
          console.log(
            chalk.green(`>> ${project_name} is up & running on boltvm. `)
          );
          break;
        case "down":
          console.log(chalk.green(`>> ${project_name} is down. `));
          break;
        default:
          console.log(
            chalk.green(`>> ${project_name} has unknown status. ${status} `)
          );
          break;
      }
    } catch (error: any) {
      exitWithMsg("Error while getting status of container: ${error.message}");
    }
  }
}
