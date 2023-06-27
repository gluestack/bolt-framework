import { Bolt } from "../../typings/bolt";
import ProjectRunner from "../../typings/bolt-project-runner";
export default class ProjectRunnerVm implements ProjectRunner {
    _yamlContent: Bolt;
    constructor(_yamlContent: Bolt);
    up(cache: boolean): Promise<void>;
    down(): Promise<void>;
    exec(): Promise<void>;
}
