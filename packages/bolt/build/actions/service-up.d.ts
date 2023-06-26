import { RunServiceOptions } from "../typings/run-service-options";
import { Bolt } from "../typings/bolt";
export default class ServiceUp {
    checkIfAlreadyUp(_yamlContent: Bolt, serviceName: string): Promise<void>;
    handle(serviceName: string, options: RunServiceOptions): Promise<void>;
}
