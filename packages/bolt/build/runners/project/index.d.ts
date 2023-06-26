import { Bolt } from "../../typings/bolt";
interface Options {
    action: "up" | "down";
}
export default class ProjectRunner {
    _yamlContent: Bolt;
    constructor(_yamlContent: Bolt);
    host(option: Options): Promise<void>;
    vm(cache: boolean, Option: Options): Promise<void>;
}
export {};
