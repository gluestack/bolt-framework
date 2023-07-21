export interface BoltServicePlatform {
  envfile: string;
  build: string;
  ports?: any[];
  volumes?: any[];
  // depends_on?: any;
  // context?: string;
}

export type serviceRunners = "local" | "docker" | "vmlocal" | "vmdocker";

export type hostServicerunner = "local" | "docker";

export interface BoltService {
  container_name: string;
  stateless: boolean;
  default_service_runner: serviceRunners;
  supported_service_runners: serviceRunners[];
  service_runners: Record<"local" | "docker", BoltServicePlatform>;
}
