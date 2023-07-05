import { DockerConfig, LocalConfig, VMConfig } from "../../typings/service-runner-config";
interface Option {
    action: "start" | "stop" | "logs";
    serviceName: string;
    isFollow?: boolean;
}
export default class ServiceRunner {
    local(configs: LocalConfig, option: Option): Promise<void>;
    docker(configs: DockerConfig, option: Option): Promise<void>;
    vm(configs: VMConfig, option: Option): Promise<void>;
}
export {};
