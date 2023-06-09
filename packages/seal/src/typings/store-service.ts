export interface StoreService {
  status: "up" | "down";
  platform: "local" | "docker" | undefined;
  port?: number | string;
  processId?: number | string;
}
