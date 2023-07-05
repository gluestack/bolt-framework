import BoltVm from "@gluestack/boltvm";
import BoltServiceRunner from "../../typings/bolt-service-runner";
import { BoltService } from "../../typings/bolt-service";
export default class ServiceRunnerVM implements BoltServiceRunner {
    boltVM: BoltVm;
    cache: boolean;
    runnerType: "vmlocal" | "vmdocker";
    serviceContent: BoltService;
    serviceName: string;
    constructor(serviceContent: BoltService, serviceName: string, cache: boolean, runnerType: "vmlocal" | "vmdocker");
    private getVmStatus;
    private exposePort;
    start(): Promise<void>;
    stop(): Promise<void>;
    logs(isFollow: boolean): Promise<void>;
    static exec(): Promise<void>;
    static down(): Promise<void>;
}
