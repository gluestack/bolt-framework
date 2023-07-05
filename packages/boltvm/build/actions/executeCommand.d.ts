export default class ExecuteCommand {
    boltInstall: boolean;
    constructor(boltInstall: boolean);
    private runCommandInsideVm;
    handle(command: string, localPath: string, detatched: any): Promise<void>;
}
