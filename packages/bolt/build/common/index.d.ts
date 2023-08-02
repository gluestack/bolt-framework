import { Bolt } from "../typings/bolt";
export default class Common {
    static getAndValidateBoltYaml(): Promise<Bolt>;
    static getAndValidateService(serviceName: string, _yamlContent: Bolt): Promise<{
        servicePath: string;
        _serviceYamlPath: string | boolean;
        yamlPath: string;
        content: import("../typings/bolt-service").BoltService;
    }>;
    static validateServiceInBoltYaml(serviceName: string): Promise<{
        _yamlPath: string;
        _yamlContent: Bolt;
    }>;
}
