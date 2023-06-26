export default class EnvGenerate {
    handle({ build }: {
        build: "prod" | "dev";
    }): Promise<void>;
}
