import { SealService } from "../typings/seal-service";
import { RunServiceOptions } from "../typings/run-service-options";
import { Seal } from "../typings/seal";
export declare function getAndValidate(serviceName: string): Promise<{
    _yamlPath: string;
    _yamlContent: Seal;
}>;
export declare function getAndValidateService(serviceName: string, _yamlContent: any): Promise<{
    servicePath: string;
    _serviceYamlPath: string | boolean;
    _ymlPath: string | boolean;
    yamlPath: string;
    content: SealService;
}>;
declare const _default: (serviceName: string, options: RunServiceOptions) => Promise<void>;
export default _default;
