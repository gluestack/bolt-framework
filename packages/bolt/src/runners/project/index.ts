import chalk from "chalk";
import { Bolt } from "../../typings/bolt";
import ProjectRunnerHost from "./host";
import ProjectRunnerVm from "./vm";

interface Options {
  action: "up" | "down" | "exec";
}

export default class ProjectRunner {
  _yamlContent: Bolt;

  constructor(_yamlContent: Bolt) {
    this._yamlContent = _yamlContent;
  }

  public async host(option: Options) {
    const projectRunnerHost = new ProjectRunnerHost(this._yamlContent);

    const { action } = option;

    switch (action) {
      case "up":
        await projectRunnerHost.up();
        break;
      case "down":
        await projectRunnerHost.down();
        break;
      default:
        console.log(chalk.red(`Invalid action: ${action}`));
        break;
    }
  }

  public async vm(option: Options, cache?: boolean) {
    const projectRunnerVm = new ProjectRunnerVm(this._yamlContent);
    const { action } = option;

    switch (action) {
      case "up":
        await projectRunnerVm.up(cache || false);
        break;
      case "down":
        await projectRunnerVm.down();
        break;
      case "exec":
        await projectRunnerVm.exec();
        break;
      default:
        console.log(chalk.red(`Invalid action: ${action}`));
        break;
    }
  }
}
