import { Command } from "commander";
import ProjectList from "../actions/project-list";

export default async (program: Command) => {
  program
    .command("project:list")
    .description(`Lists all the Bolt projects in your host machine`)
    .action(async () => {
      const projectList = new ProjectList();
      await projectList.handle();
    });
};
