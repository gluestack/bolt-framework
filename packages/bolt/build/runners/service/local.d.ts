import BoltServiceRunner from "../../typings/bolt-service-runner";
export default class ServiceRunnerLocal implements BoltServiceRunner {
    volume: string;
    build: string;
    constructor(servicePath: string, build: string);
    private run;
    private printCommand;
    start(serviceName: string): Promise<number | undefined>;
    stop(processId: number): Promise<void>;
    logs(isFollow: boolean, serviceName: string): Promise<void>;
}
