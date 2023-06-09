export interface IHealthCheck {
  test: string[];
  interval: string;
  timeout: string;
  retries: number;
  start_period?: string;
}

interface IServiceBase {
  command?: string;
  container_name: string;
  volumes?: string[];
  ports?: string[];
  env_file?: string[];
  environment?: any;
  depends_on?: any;
  restart: string;
  healthcheck?: IHealthCheck;
  entrypoint?: any;
}

interface IServiceWithBuild extends IServiceBase {
  build: string | IBuildArgs;
}

interface IBuildArgs {
  context: string;
  dockerfile: string;
}

interface IServiceWithImage extends IServiceBase {
  image: string;
}

export type IService = IServiceWithBuild | IServiceWithImage;

export interface IDockerCompose {
  version: string;
  services: { [key: string]: IService };

  generate(): Promise<void>;
  pushToService(name: string, service: IService): void;
  toYAML(): string;

  start(projectName: string, filepath: string): Promise<void>;
  stop(projectName: string, filepath: string): Promise<void>;

  addService(projectName: string, serviceName: string, path: string): Promise<void>;
}
