import { BoltService } from "../typings/bolt-service";
export default class ServiceDiscovery {
    serviceContent: BoltService;
    constructor(serviceContent: BoltService);
    isPortUsed(port: number): Promise<boolean>;
    findAvailablePort(basePort: number, maxRetries: number): Promise<number>;
    discoverPort(serviceName?: string): Promise<number[]>;
    static discoverProductionHost(servicePath: string): Promise<any>;
}
