import { StoreService } from "../typings/store-service";
import { Bolt } from "../typings/bolt";
export default class ServiceDown {
    checkIfAlreadyDown(_yamlContent: any, serviceName: string): Promise<StoreService>;
    checkAllServiceDown(_yamlContent: Bolt): Promise<boolean>;
    handle(serviceName: string): Promise<void>;
}
