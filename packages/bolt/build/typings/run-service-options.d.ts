export type RunServiceOptions = {
    serviceRunner: "docker" | "local";
    ports: string[];
};
