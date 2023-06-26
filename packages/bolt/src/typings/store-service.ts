export type ServiceRunners = "local" | "docker";

export type ProjectRunners = "host" | "vm" | "none";

export interface StoreService {
  status: "up" | "down";
  serviceRunner?: ServiceRunners | null;
  port?: string[] | null;
  processId?: number | string | null;
}

export interface StoreServices {
  [key: string]: StoreService;
}
