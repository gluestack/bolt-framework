import { SealService } from "../../typings/seal-service";
export default class DeployClass {
    store: any;
    zipPath: string;
    services: SealService[];
    cwd: string;
    constructor();
    setStore(): Promise<void>;
    saveStore(): Promise<void>;
    getSealContent(): Promise<import("../../typings/seal").Seal>;
    setServices(): Promise<void>;
    createZip(): Promise<string>;
    auth(doAuth: boolean): Promise<void>;
    upload(): Promise<void>;
    watch(): Promise<void>;
}
