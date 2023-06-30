import { Bolt } from "../../typings/bolt";
interface Options {
    action: "up" | "down" | "exec";
}
export default class ProjectRunner {
    _yamlContent: Bolt;
    constructor(_yamlContent: Bolt);
    host(option: Options): Promise<void>;
    vm(option: Options, cache?: boolean): Promise<void>;
}
export {};
