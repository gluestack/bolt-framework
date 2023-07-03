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
        define(["require", "exports", "chalk", "path", "child_process", "../helpers/fs-exists", "../helpers/update-store", "../helpers/kill-process", "../helpers/exit-with-msg", "../helpers/validate-bolt-file", "../helpers/execute-detached", "../helpers/validate-project-status", "../runners/vm", "../constants/bolt-vm"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const path_1 = require("path");
    const child_process_1 = require("child_process");
    const fs_exists_1 = require("../helpers/fs-exists");
    const update_store_1 = require("../helpers/update-store");
    const kill_process_1 = require("../helpers/kill-process");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const validate_bolt_file_1 = require("../helpers/validate-bolt-file");
    const execute_detached_1 = require("../helpers/execute-detached");
    const validate_project_status_1 = require("../helpers/validate-project-status");
    const vm_1 = __importDefault(require("../runners/vm"));
    const bolt_vm_1 = require("../constants/bolt-vm");
    class Run {
        runProjectInsideVm(vmPort, projectConfig, localPath, isDetatched) {
            return __awaiter(this, void 0, void 0, function* () {
                const { vm } = projectConfig;
                const args = [
                    "-p",
                    `${vmPort}`,
                    ...bolt_vm_1.SSH_CONFIG,
                    `"${bolt_vm_1.VM_INTERNALS_CONFIG.command} && ${vm.command}"`,
                ];
                if (isDetatched) {
                    // Runs the project in detatch mode and store its logs into log files
                    return yield (0, execute_detached_1.executeDetachedWithLogs)("ssh", args, (0, path_1.join)(localPath, bolt_vm_1.BOLTVM.LOG_FOLDER, "project_runner"), {
                        shell: true,
                        detached: true,
                    }, "Project Runner");
                }
                else {
                    // Runs the project in foreground mode
                    const child = (0, child_process_1.spawn)("ssh", args, {
                        stdio: "inherit",
                        shell: true,
                    });
                    return child.pid;
                }
            });
        }
        // Expose port to host machine
        exposePort(vmPort, port) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(chalk_1.default.yellow(`>> Exposing port ${port}`));
                if (!port.includes(":")) {
                    console.log(chalk_1.default.red(`>> Invalid port mapping ${port}`));
                    return null;
                }
                const portMap = port.split(":");
                port = `${portMap[0]}:localhost:${portMap[1]}`;
                const args = ["-p", `${vmPort}`, "-N", "-L", port, ...bolt_vm_1.SSH_CONFIG];
                const sshPid = yield (0, execute_detached_1.executeDetached)("ssh", args, { detached: true }, "ssh");
                return sshPid;
            });
        }
        handle(localPath, detatched) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Check for file path exists or not
                    if (!(yield (0, fs_exists_1.exists)(localPath))) {
                        (0, exit_with_msg_1.exitWithMsg)(">> Please specify correct path in source");
                        return;
                    }
                    // Check for valid boltvm yml file
                    const boltConfig = yield (0, validate_bolt_file_1.validateBoltYaml)(localPath);
                    const { vm, project_id } = boltConfig;
                    // Check if boltvm is up or not
                    const project = yield (0, validate_project_status_1.validateProjectStatus)("run", boltConfig);
                    const sshPort = project.sshPort;
                    const conn = yield vm_1.default.connectOnce(sshPort);
                    yield conn.end();
                    // Expose ports
                    const portExposePromises = [];
                    for (const port of vm.ports) {
                        portExposePromises.push(this.exposePort(sshPort, port));
                    }
                    const sshPids = yield Promise.all(portExposePromises);
                    console.log(chalk_1.default.green(">> Ports exposed"));
                    // Run project inside vm
                    console.log(chalk_1.default.yellow(">> Started running project inside VM..."));
                    const projectRunnerId = (_a = (yield this.runProjectInsideVm(sshPort, boltConfig, localPath, detatched))) !== null && _a !== void 0 ? _a : 0;
                    console.log(chalk_1.default.green(">> Project running inside VM"));
                    // Update project status
                    const json = Object.assign(Object.assign({}, project), { status: "up", sshProcessIds: sshPids, projectRunnerId: projectRunnerId });
                    yield (0, update_store_1.updateStore)("projects", project_id, json);
                    // Kill process on ctrl+c
                    process.on("SIGINT", () => {
                        (() => __awaiter(this, void 0, void 0, function* () {
                            console.log(chalk_1.default.yellow(">> Killing process..."));
                            yield (0, kill_process_1.killMultipleProcesses)([...sshPids, projectRunnerId]);
                            yield (0, update_store_1.updateStore)("projects", project_id, Object.assign(Object.assign({}, project), { status: "build", sshProcessIds: null, projectRunnerId: null }));
                            process.exit(0);
                        }))();
                    });
                }
                catch (err) {
                    (0, exit_with_msg_1.exitWithMsg)(err.message);
                }
            });
        }
    }
    exports.default = Run;
});
