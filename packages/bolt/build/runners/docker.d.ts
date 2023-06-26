export default class Docker {
    private volume;
    private container_name;
    private build;
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
    static start(container_name: string, servicePath: string, build: string, ports: string[], envfile?: string, volumes?: string[]): Promise<void>;
    static stop(container_name: string, servicePath: string, build: string, ports?: string[], envfile?: string): Promise<void>;
    static logs(container_name: string, servicePath: string, build: string, ports: string[] | undefined, envfile: string | undefined, isFollow: boolean): Promise<void>;
    static startOnly(container_name: string, ports: string[], volume: string, image: string): Promise<void>;
    static stopOnly(container_name: string): Promise<void>;
}
