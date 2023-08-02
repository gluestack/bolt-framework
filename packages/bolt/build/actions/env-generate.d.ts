import { Ingress } from "../typings/ingress";
type ServiceInfo = {
    ports: any;
    serviceName: string;
    servicePath: string;
    ingress: Ingress[] | null | undefined;
};
interface IHandlerFunctionArgs {
    environment: "local" | "production";
    serviceInfo?: ServiceInfo;
}
export default class EnvGenerate {
    handle({ environment, serviceInfo, }: IHandlerFunctionArgs): Promise<void>;
    local(serviceInfo: ServiceInfo): Promise<void>;
    production(): Promise<void>;
}
export {};
