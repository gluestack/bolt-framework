export interface BoltServicePlatform {
  envfile: string;
  build: string;
  depends_on?: any;
  ports?: any[];
  volumes?: any[];
  context?: string;
}

export interface BoltService {
  container_name: string;
  stateless: boolean;
  service_runners: Record<"local" | "docker" | "vm", BoltServicePlatform>;
}
