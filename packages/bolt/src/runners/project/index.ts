import chalk from "chalk";
import { Bolt } from "../../typings/bolt";
import ProjectRunnerHost from "./host";
// import ProjectRunnerVm from "./vm";

interface Options {
  action: "up" | "down";
}

export default class ProjectRunner {
  _yamlContent: Bolt;

  constructor(_yamlContent: Bolt) {
    this._yamlContent = _yamlContent;
  }

  public async host(option: Options) {
    const projectRunnerHost = new ProjectRunnerHost(this._yamlContent);

    // If action is up, run the project in host
    if (option.action === "up") {
      await projectRunnerHost.up();
      return;
    }

    // If action is down, stop the project in host
    await projectRunnerHost.down();
  }

  public async vm(cache: boolean, Option: Options) {
    console.log(chalk.green("coming soon..."));
    process.exit();
    // const projectRunnerVm = new ProjectRunnerVm(this._yamlContent);

    // // If action is up, run the project in vm
    // if (Option.action === "up") {
    //   await projectRunnerVm.up(cache);
    //   return;
    // }

    // // If action is down, stop the project in vm
    // await projectRunnerVm.down();
    // return;
  }
}
