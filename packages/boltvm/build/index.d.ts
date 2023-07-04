import { IBoltVm } from "./typings/boltvm";
export default class BoltVm implements IBoltVm {
    location: string;
    constructor(location: string);
    addMetadata(): Promise<void>;
    create(cache: boolean): Promise<void>;
    run(command: string, detached: boolean): Promise<void>;
    exposePort(port: string): Promise<void>;
    exec(): Promise<void>;
    log(isFollow: boolean): Promise<void>;
    down(): Promise<void>;
    status(): Promise<void>;
    doctor(): Promise<void>;
}
