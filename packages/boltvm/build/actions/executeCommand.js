var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "chalk", "child_process", "path", "../constants/bolt-vm", "../helpers/execute-detached", "../helpers/exit-with-msg", "../helpers/fs-exists", "../helpers/validate-bolt-file", "../helpers/validate-project-status", "../runners/vm"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const child_process_1 = require("child_process");
    const path_1 = require("path");
    const bolt_vm_1 = require("../constants/bolt-vm");
    const execute_detached_1 = require("../helpers/execute-detached");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const fs_exists_1 = require("../helpers/fs-exists");
    const validate_bolt_file_1 = require("../helpers/validate-bolt-file");
    const validate_project_status_1 = require("../helpers/validate-project-status");
    const vm_1 = __importDefault(require("../runners/vm"));
    class ExecuteCommand {
        constructor(boltInstall) {
            this.boltInstall = boltInstall;
        }
        runCommandInsideVm(vmPort, command, localPath, isDetatched) {
            return __awaiter(this, void 0, void 0, function* () {
                const { projectCdCommand, boltInstallationCommand } = bolt_vm_1.VM_INTERNALS_CONFIG;
                // Configuring command to run inside VM
                let mainCommand = `${projectCdCommand} && ${command}`;
                mainCommand = this.boltInstall
                    ? `${boltInstallationCommand} && ${mainCommand}`
                    : mainCommand;
                const args = ["-p", `${vmPort}`, ...bolt_vm_1.SSH_CONFIG, `"${mainCommand}"`];
                if (isDetatched) {
                    // Runs the command in detatch mode and store its logs into log files
                    return yield (0, execute_detached_1.executeDetachedWithLogs)("ssh", args, (0, path_1.join)(localPath, bolt_vm_1.BOLTVM.LOG_FOLDER, "command_logs"), {
                        shell: true,
                        detached: true,
                    }, "Command Runner");
                }
                else {
                    // Runs the command in foreground mode
                    const child = (0, child_process_1.spawn)("ssh", args, {
                        stdio: "inherit",
                        shell: true,
                    });
                    return child.pid;
                }
            });
        }
        handle(command, localPath, detatched) {
            return __awaiter(this, void 0, void 0, function* () {
                // Check for file path exists or not
                if (!(yield (0, fs_exists_1.exists)(localPath))) {
                    (0, exit_with_msg_1.exitWithMsg)(">> Please specify correct path in source");
                    return;
                }
                // Check for valid boltvm yml file
                const boltConfig = yield (0, validate_bolt_file_1.validateBoltYaml)(localPath);
                // Check if boltvm is up or not
                const project = yield (0, validate_project_status_1.validateProjectStatus)("run", boltConfig);
                const vmPort = project.sshPort;
                const conn = yield vm_1.default.connectOnce(vmPort);
                yield conn.end();
                console.log(chalk_1.default.green(`>> Started running ${command} inside VM...`));
                // Run command inside vm
                yield this.runCommandInsideVm(vmPort, command, localPath, detatched);
                console.log(chalk_1.default.green(`>> Executed ${command} successfully in VM!`));
            });
        }
    }
    exports.default = ExecuteCommand;
});
