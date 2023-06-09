import { Command } from "commander";
export default class Commander {
    cwd: string;
    program: Command;
    static register(): Promise<void>;
    init(): Promise<void>;
    addCommands(): Promise<void>;
    close(): Promise<void>;
}
