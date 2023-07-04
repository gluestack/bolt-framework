export interface IBoltVm {
  location: string;

  addMetadata(): Promise<void>;
  create(cache: boolean): Promise<void>;
  run(command: string, detatched: boolean): Promise<void>;
  exposePort(port: string): Promise<void>;
  exec(): Promise<void>;
  log(isFollow: boolean): Promise<void>;
  down(): Promise<void>;
  status(): Promise<void>;
  doctor(): Promise<void>;
}
