export interface DockerConfig {
  containerName: string;
  servicePath: string;
  build: string;
  envFile: string;
  ports: string[];
  volumes: string[];
  isFollow: boolean;
}

export interface LocalConfig {
  servicePath: string;
  serviceName: string;
  build: string;
  isFollow: boolean;
  processId: number;
}
