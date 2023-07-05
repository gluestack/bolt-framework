import { Command } from "commander";
import ProjectInfo from "../actions/project-info";

export default async (program: Command) => {
  program
    .command("project:info")
    .description(`Prints the project's information from bolt.yaml file.`)
    .action(async () => {
      const projectInfo = new ProjectInfo();
      await projectInfo.handle();
    });
};
