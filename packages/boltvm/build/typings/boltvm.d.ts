export interface IBoltVm {
    location: string;
    addMetadata(): Promise<void>;
    create(cache: boolean): Promise<void>;
    run(command: string, detatched: boolean): Promise<void>;
    exposePort(ports: string[]): Promise<void>;
    exec(): Promise<void>;
    log(isFollow: boolean): Promise<void>;
    down(): Promise<void>;
    status(): Promise<void>;
    doctor(): Promise<void>;
    executeCommand(command: string, detached: boolean, options: ExecutionOptions): Promise<void>;
}
export interface ExecutionOptions {
    boltInstall: boolean;
}
