import { Bolt } from "../../typings/bolt";
import { ServiceRunners } from "../../typings/store-service";
export default class ProjectRunnerHost {
    _yamlContent: Bolt;
    constructor(_yamlContent: Bolt);
    resolveServiceRunner(defaultServiceRunner: ServiceRunners, providedRunner: Array<ServiceRunners>): ServiceRunners;
    up(): Promise<void>;
    down(): Promise<void>;
}
