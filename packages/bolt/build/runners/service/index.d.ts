import { DockerConfig, LocalConfig } from "../../typings/project-runner-config";
interface Option {
    action: "start" | "stop" | "logs" | "exec";
    serviceName?: string;
}
export default class ServiceRunner {
    local(configs: LocalConfig, option: Option): Promise<void>;
    docker(configs: DockerConfig, option: Option): Promise<void>;
}
export {};
