import { BoltService } from "../../typings/bolt-service";
export default class DeployClass {
    store: any;
    zipPath: string;
    services: BoltService[];
    cwd: string;
    constructor();
    setStore(): Promise<void>;
    saveStore(): Promise<void>;
    getBoltFileContent(): Promise<import("../../typings/bolt").Bolt>;
    setServices(): Promise<void>;
    createZip(): Promise<string>;
    auth(doAuth: boolean): Promise<{
        user: any;
        projects: any;
    } | undefined>;
    setProject(projects: any[]): Promise<any>;
    upload(): Promise<any>;
    submit({ projectId, fileId, userId, }: {
        projectId: number;
        fileId: number;
        userId: number;
    }): Promise<any>;
    watch(): Promise<void>;
}
