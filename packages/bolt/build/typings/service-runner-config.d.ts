import { BoltService } from "./bolt-service";
export interface DockerConfig {
    containerName: string;
    servicePath: string;
    build: string;
    envFile: string;
    ports: string[];
    volumes: string[];
}
export interface LocalConfig {
    servicePath: string;
    build: string;
    processId: number;
}
export interface VMConfig {
    serviceContent: BoltService;
    serviceName: string;
    cache: boolean;
    runnerType: "vmlocal" | "vmdocker";
}
