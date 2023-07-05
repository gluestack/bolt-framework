import { Ingress } from "./ingress";

export interface Service {
  path: string;
}

export interface VM {
  name: string;
}

export interface Bolt {
  envfile: string;
  project_id: string;
  project_name: string;
  services: Record<any, Service>;
  ingress?: Ingress[] | null;
  vm?: VM;
}
