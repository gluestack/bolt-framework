export interface IBoltVm {
    location: string;
    addMetadata(): Promise<void>;
    create(cache: boolean): Promise<void>;
    run(detatched: boolean): Promise<void>;
    exec(): Promise<void>;
    log(isFollow: boolean): Promise<void>;
    down(): Promise<void>;
    status(): Promise<void>;
    doctor(): Promise<void>;
}
