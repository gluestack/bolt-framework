/**
 * Env
 *
 * This class is responsible for generating the .env file
 * in your gluestack app
 */
export default class Env {
    keys: any;
    keyCharacter: "%";
    envs: ChildEnv[];
    filepath: string;
    isProd: boolean;
    constructor(envContent: any, routes?: any, isProd?: boolean);
    addEnv(serviceName: string, envContent: any, path: string): Promise<any>;
    generate(): Promise<void>;
    writeEnv(): Promise<void>;
    private getReplaceKeys;
}
declare class ChildEnv {
    prefix: string;
    serviceName: string;
    keys: any;
    filepath: string;
    constructor(prefix: string, serviceName: string, keys: any, path: string);
    updateKey(key: string, value: string): void;
    writeEnv(): Promise<void>;
}
export {};
