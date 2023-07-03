export interface BoltServicePlatform {
    envfile: string;
    build: string;
    ports?: any[];
    volumes?: any[];
}
export interface BoltService {
    container_name: string;
    stateless: boolean;
    service_runners: Record<"local" | "docker" | "vm", BoltServicePlatform>;
}
