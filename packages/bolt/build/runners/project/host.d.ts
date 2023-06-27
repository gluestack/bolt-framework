import { Bolt } from "../../typings/bolt";
import { ServiceRunners } from "../../typings/store-service";
import ProjectRunner from "../../typings/bolt-project-runner";
export default class ProjectRunnerHost implements ProjectRunner {
    _yamlContent: Bolt;
    constructor(_yamlContent: Bolt);
    resolveServiceRunner(defaultServiceRunner: ServiceRunners, providedRunner: Array<ServiceRunners>): ServiceRunners;
    up(): Promise<void>;
    down(): Promise<void>;
}
