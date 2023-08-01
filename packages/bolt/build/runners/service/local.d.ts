import BoltServiceRunner from "../../typings/bolt-service-runner";
export default class ServiceRunnerLocal implements BoltServiceRunner {
    volume: string;
    build: string;
    serviceName: string;
    ports: string[];
    constructor(serviceName: string, servicePath: string, build: string, ports: string[]);
    private run;
    private printCommand;
    start(): Promise<void>;
    stop(processId: number): Promise<void>;
    logs(isFollow: boolean): Promise<void>;
}
