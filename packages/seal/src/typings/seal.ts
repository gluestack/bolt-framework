import { Ingress } from "./ingress";

export interface Service {
  path: string;
}

export interface Seal {
  envfile: string;
  project_id: string;
  project_name: string;
  default_runner: "local" | "docker";
  services: Record<any, Service>;
  ingress?: Ingress[];
}
