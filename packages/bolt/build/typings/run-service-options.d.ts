export type RunServiceOptions = {
    serviceRunner: "docker" | "local" | "vmlocal" | "vmdocker";
    cache?: boolean;
};
