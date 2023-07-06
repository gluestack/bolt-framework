import { StoreService } from "../typings/store-service";
export default class ServiceDown {
    checkIfAlreadyDown(_yamlContent: any, serviceName: string): Promise<StoreService>;
    handle(serviceName: string): Promise<void>;
}
