export type ServiceRunners = "local" | "docker" | "vmlocal" | "vmdocker";
export type ProjectRunners = "host" | "vm" | "none";
export interface StoreService {
    status: "up" | "down";
    serviceRunner: ServiceRunners | null;
    projectRunner: ProjectRunners | null;
    port?: string[] | null;
    processId?: number | string | null;
}
export interface StoreServices {
    [key: string]: StoreService;
}
