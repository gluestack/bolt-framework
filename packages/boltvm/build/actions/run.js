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
        define(["require", "exports", "chalk", "path", "child_process", "../helpers/fs-exists", "../helpers/update-store", "../helpers/kill-process", "../helpers/exit-with-msg", "../helpers/validate-seal-file", "../helpers/execute-detached", "../helpers/validate-project-status", "../runners/vm", "../constants"], factory);
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
    const validate_seal_file_1 = require("../helpers/validate-seal-file");
    const execute_detached_1 = require("../helpers/execute-detached");
    const validate_project_status_1 = require("../helpers/validate-project-status");
    const vm_1 = __importDefault(require("../runners/vm"));
    const constants_1 = require("../constants");
    function runProjectInsideVm(vmPort, projectConfig, isDetatched) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = [
                "-p",
                `${vmPort}`,
                ...constants_1.SSH_CONFIG,
                `"cd ${projectConfig.destination} && ${projectConfig.command}"`,
            ];
            if (isDetatched) {
                // Runs the project in detatch mode and store its logs into log files
                return yield (0, execute_detached_1.executeDetachedWithLogs)("ssh", args, (0, path_1.join)(projectConfig.source, constants_1.SEALVM.LOG_FOLDER, projectConfig.name), {
                    shell: true,
                    detached: true,
                });
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
    function exposePort(vmPort, port) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(chalk_1.default.yellow(`>> Exposing port ${port}`));
            if (!port.includes(":")) {
                console.log(chalk_1.default.red(`>> Invalid port mapping ${port}`));
                return null;
            }
            const portMap = port.split(":");
            port = `${portMap[0]}:localhost:${portMap[1]}`;
            const args = ["-p", `${vmPort}`, "-N", "-L", port, ...constants_1.SSH_CONFIG];
            const sshPid = yield (0, execute_detached_1.executeDetached)("ssh", args, { detached: true });
            return sshPid;
        });
    }
    function default_1(localPath, option) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDetached = option.detatch || false;
                // Check for file path exists or not
                if (!(yield (0, fs_exists_1.exists)(localPath))) {
                    (0, exit_with_msg_1.exitWithMsg)(">> Please specify correct path in source");
                    return;
                }
                // Check for valid sealvm yml file
                const sealConfig = yield (0, validate_seal_file_1.validateSealFile)(localPath);
                // Check if sealvm is up or not
                const project = yield (0, validate_project_status_1.validateProjectStatus)(sealConfig.projectId, "run");
                const sshPort = project.sshPort;
                const conn = yield vm_1.default.connectOnce(sshPort);
                conn.end();
                // Expose ports
                const portExposePromises = [];
                for (const port of sealConfig.ports) {
                    portExposePromises.push(exposePort(sshPort, port));
                }
                const sshPids = yield Promise.all(portExposePromises);
                console.log(chalk_1.default.green(">> Ports exposed"));
                // Run project inside vm
                console.log(chalk_1.default.yellow("Starting running project inside vm..."));
                const projectRunnerId = (_a = (yield runProjectInsideVm(sshPort, sealConfig, isDetached))) !== null && _a !== void 0 ? _a : 0;
                console.log(chalk_1.default.green(">> Project running inside vm"));
                // Update project status
                const json = Object.assign(Object.assign({}, project), { status: "up", sshProcessIds: sshPids, projectRunnerId: projectRunnerId });
                yield (0, update_store_1.updateStore)("projects", sealConfig.projectId, json);
                // Kill process on ctrl+c
                process.on("SIGINT", () => {
                    (() => __awaiter(this, void 0, void 0, function* () {
                        console.log(chalk_1.default.yellow(">> Killing process..."));
                        yield (0, kill_process_1.killMultipleProcesses)([...sshPids, projectRunnerId]);
                        yield (0, update_store_1.updateStore)("projects", sealConfig.projectId, Object.assign(Object.assign({}, project), { status: "build", sshProcessIds: null, projectRunnerId: null }));
                        process.exit(0);
                    }))();
                });
            }
            catch (err) {
                (0, exit_with_msg_1.exitWithMsg)(err.message);
            }
        });
    }
    exports.default = default_1;
});
