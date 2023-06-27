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
    private stopExec;
    private remove;
    private printCommand;
    private getLog;
    start(): Promise<void>;
    stop(): Promise<void>;
    logs(isFollow: boolean): Promise<void>;
    static startOnly(container_name: string, ports: string[], volume: string, image: string): Promise<void>;
    static stopOnly(container_name: string): Promise<void>;
}
