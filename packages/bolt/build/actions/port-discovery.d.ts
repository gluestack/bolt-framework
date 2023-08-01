import { BoltService } from "../typings/bolt-service";
export default class PortDiscovery {
    serviceContent: BoltService;
    constructor(serviceContent: BoltService);
    handle(): Promise<{
        ports: any;
        serviceName: string;
    }>;
    production(): Promise<{
        ports: any;
        serviceName: string;
    }>;
}
