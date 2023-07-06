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
        define(["require", "exports", "chalk", "../constants/bolt-vm", "../helpers/execute-detached", "../helpers/exit-with-msg", "../helpers/fs-exists", "../helpers/update-store", "../helpers/validate-bolt-file", "../helpers/validate-project-status"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const bolt_vm_1 = require("../constants/bolt-vm");
    const execute_detached_1 = require("../helpers/execute-detached");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const fs_exists_1 = require("../helpers/fs-exists");
    const update_store_1 = require("../helpers/update-store");
    const validate_bolt_file_1 = require("../helpers/validate-bolt-file");
    const validate_project_status_1 = require("../helpers/validate-project-status");
    class ExposePort {
        // Expose port to host machine
        exposePort(vmPort, port) {
            return __awaiter(this, void 0, void 0, function* () {
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
        handle(localPath, ports) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Check for file path exists or not
                    if (!(yield (0, fs_exists_1.exists)(localPath))) {
                        yield (0, exit_with_msg_1.exitWithMsg)(">> Invalid File Path");
                        return;
                    }
                    // Check for valid boltvm yml file
                    const boltConfig = yield (0, validate_bolt_file_1.validateBoltYaml)(localPath);
                    const { project_id } = boltConfig;
                    const project = yield (0, validate_project_status_1.validateProjectStatus)("exec", boltConfig);
                    const vmPort = project.sshPort;
                    const portExposePromises = [];
                    console.log(chalk_1.default.yellow(">> Exposing ports, if available..."));
                    for (const port of ports) {
                        portExposePromises.push(this.exposePort(vmPort, port));
                    }
                    console.log(chalk_1.default.green(`>> Ports Tunnel Created!`));
                    const sshPids = yield Promise.all(portExposePromises);
                    if (!project.sshProcessIds) {
                        project.sshProcessIds = [];
                    }
                    const json = Object.assign(Object.assign({}, project), { sshProcessIds: sshPids });
                    yield (0, update_store_1.updateStore)("projects", project_id, json);
                }
                catch (error) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> Some Error occured while exposing port: ${error.message}`);
                }
            });
        }
    }
    exports.default = ExposePort;
});
