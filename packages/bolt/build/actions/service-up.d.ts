import { RunServiceOptions } from "../typings/run-service-options";
export default class ServiceUp {
    private checkIfAlreadyUp;
    private validateServiceRunnerConfig;
    handle(serviceName: string, options: RunServiceOptions): Promise<void>;
}
