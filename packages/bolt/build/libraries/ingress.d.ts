export default class Ingress {
    static removeIfExist(containerName: string): Promise<void>;
    static start(containerName: string, ports: string[], volume: string, image: string): Promise<void>;
    static stop(containerName: string): Promise<void>;
}
