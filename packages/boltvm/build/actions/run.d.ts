export default class Run {
    private runProjectInsideVm;
    private exposePort;
    handle(localPath: string, detatched: any): Promise<void>;
}
