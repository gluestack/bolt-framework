import { Bolt } from "../../typings/bolt";
import ProjectRunner from "../../typings/bolt-project-runner";
import BoltVm from "@gluestack/boltvm";
export default class ProjectRunnerVm implements ProjectRunner {
    _yamlContent: Bolt;
    boltVM: BoltVm;
    constructor(_yamlContent: Bolt);
    private resolveServiceRunner;
    private updateStatusOfAllServices;
    up(cache: boolean): Promise<void>;
    down(): Promise<void>;
    exec(): Promise<void>;
}
