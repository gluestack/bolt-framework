import chalk from "chalk";
import { execute } from "../helpers/execute";
import Common from "../common";
import ServiceList from "../actions/service-list";
import RouteList from "./route-list";

export default class ProjectInfo {
  public async handle(): Promise<void> {
    const _yamlContent = await Common.getAndValidateBoltYaml();

    console.log(chalk.blueBright("Project Info\n"));
    console.log("Project Name: ", chalk.yellow(_yamlContent.project_name));
    console.log("Project ID: ", chalk.yellow(_yamlContent.project_id));

    console.log(chalk.blueBright("\nServices List\n"));
    const projectServiceList = new ServiceList();
    await projectServiceList.handle();

    console.log(chalk.blueBright("\nRoute List\n"));
    const projectRouteList = new RouteList();
    await projectRouteList.handle();
  }
}
