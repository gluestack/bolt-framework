import { RunServiceOptions } from "../typings/run-service-options";
export default class ServiceUp {
    private checkIfAlreadyUp;
    private validateServiceRunnerConfig;
    checkDependentServicesStatus(serviceName: string, dependentServices: string[]): Promise<void>;
    handle(serviceName: string, options: RunServiceOptions): Promise<void>;
}
