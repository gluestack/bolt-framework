import { BoltService } from "../../typings/bolt-service";
export default class DeployClass {
    store: any;
    zipPath: string;
    services: BoltService[];
    cwd: string;
    constructor();
    setStore(): Promise<void>;
    saveStore(): Promise<void>;
    getSealContent(): Promise<import("../../typings/bolt").Bolt>;
    setServices(): Promise<void>;
    createZip(): Promise<string>;
    auth(doAuth: boolean): Promise<void>;
    upload(): Promise<void>;
    watch(): Promise<void>;
}
