import { Ingress } from "./ingress";

export interface Service {
  path: string;
}

// interface host {
//   command: string;
// }

export interface Vm {
  name: string;
  source: string;
  destination: string;
  ports: string[];
  command: string;
}

export interface Bolt {
  envfile: string;
  project_id: string;
  project_name: string;
  default_project_runner: "host" | "vm";
  default_service_runner: "local" | "docker";
  services: Record<any, Service>;
  ingress?: Ingress[] | null;
  // server: {
  //   host: host;
  //   vm: Vm;
  // };
}
