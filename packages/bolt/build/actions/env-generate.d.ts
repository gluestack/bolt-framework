export default class EnvGenerate {
    handle({ build, discoveredPorts, }: {
        build: "prod" | "dev";
        discoveredPorts?: {
            ports: any;
            serviceName: String;
        };
    }): Promise<void>;
}
