import { IHealthCheck } from "./docker-compose";

export interface SealServicePlatform {
  envfile: string;
  build: string;
  healthcheck?: IHealthCheck;
  depends_on?: any;
  ports?: any[];
  volumes?: any[];
  context?: string;
}

export interface SealService {
  container_name: string;
  stateless: boolean;
  platforms: Record<"local" | "docker", SealServicePlatform>;
}
