export default class ExecuteCommand {
    private runCommandInsideVm;
    handle(command: string, localPath: string, detatched: any): Promise<void>;
}
