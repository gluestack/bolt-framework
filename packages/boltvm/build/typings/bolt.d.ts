import { Ingress } from "./ingress";
export interface Service {
    path: string;
}
export interface VM {
    name: string;
    ports: string[];
    command: string;
}
export interface IBolt {
    envfile: string;
    project_id: string;
    project_name: string;
    default_project_runner: "host" | "vm";
    default_service_runner: "local" | "docker";
    services: Record<any, Service>;
    ingress?: Ingress[] | null;
    vm: VM;
}
