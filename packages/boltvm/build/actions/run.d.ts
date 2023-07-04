export default class Run {
    private runProjectInsideVm;
    handle(command: string, localPath: string, detatched: any): Promise<void>;
}
