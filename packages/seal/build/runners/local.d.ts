export default class Local {
    private volume;
    private build;
    constructor(servicePath: string, build: string);
    private run;
    private printCommand;
    static start(servicePath: string, build: string): Promise<number | undefined>;
    static stop(processId: number): Promise<unknown>;
    static logs(serviceName: string, servicePath: string, isFollow: boolean): Promise<void>;
}
