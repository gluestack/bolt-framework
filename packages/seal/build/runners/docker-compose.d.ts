import { IDockerCompose, IService } from "../typings/docker-compose";
import { SealServicePlatform } from "../typings/seal-service";
/**
 * Docker Compose
 *
 * This class is responsible for generating the seal.compose.yml file
 */
export default class DockerCompose implements IDockerCompose {
    version: string;
    services: {
        [key: string]: IService;
    };
    constructor();
    toYAML(): string;
    pushToService(name: string, service: IService): void;
    generate(): Promise<void>;
    addService(projectName: string, serviceName: string, path: string, content?: SealServicePlatform): Promise<void>;
    addNginx(ports?: string[]): Promise<void>;
    start(projectName: string, filepath: string): Promise<void>;
    stop(projectName: string, filepath: string): Promise<void>;
    private printCommand;
}
