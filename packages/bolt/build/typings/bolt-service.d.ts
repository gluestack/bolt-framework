export interface BoltServicePlatform {
    envfile: string;
    build: string;
    ports?: any[];
    volumes?: any[];
}
export type serviceRunners = "local" | "docker" | "vmlocal" | "vmdocker";
export type hostServicerunner = "local" | "docker";
export interface BoltService {
    container_name: string;
    stateless: boolean;
    service_discovery_offset: number[];
    depends_on?: string[];
    default_service_runner: serviceRunners;
    supported_service_runners: serviceRunners[];
    service_runners: Record<"local" | "docker", BoltServicePlatform>;
}
