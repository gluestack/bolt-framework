import BoltServiceRunner from "../../typings/bolt-service-runner";
export default class ServiceRunnerDocker implements BoltServiceRunner {
    volume: string;
    private container_name;
    build: string;
    private envfile;
    private ports;
    private volumes;
    constructor(container_name: string, servicePath: string, build: string, ports: string[], envfile?: string, volumes?: string[]);
    private create;
    private run;
    stopExec(): Promise<void>;
    remove(): Promise<void>;
    private printCommand;
    private getLog;
    start(): Promise<void>;
    stop(): Promise<void>;
    logs(isFollow: boolean): Promise<void>;
}
