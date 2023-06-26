export default class Log {
    checkIfServiceIsUp(_yamlContent: any, serviceName: string): Promise<any>;
    handle(serviceName: string, option: any): Promise<void>;
}
