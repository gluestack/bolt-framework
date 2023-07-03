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
        define(["require", "exports", "chalk", "path", "../constants/bolt-vm", "../constants/vm-commands", "../helpers/connect-to-vm", "../helpers/execute-detached", "../helpers/kill-process"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const path_1 = require("path");
    const bolt_vm_1 = require("../constants/bolt-vm");
    const vm_commands_1 = require("../constants/vm-commands");
    const connect_to_vm_1 = require("../helpers/connect-to-vm");
    const execute_detached_1 = require("../helpers/execute-detached");
    const kill_process_1 = require("../helpers/kill-process");
    class Vm {
        constructor(projectPath, containerPath, sshPort) {
            this.projectPath = projectPath;
            this.containerPath = containerPath;
            this.sshPort = sshPort;
        }
        boot() {
            return __awaiter(this, void 0, void 0, function* () {
                const args = (0, vm_commands_1.VM_BOOT)(this.containerPath, this.sshPort);
                return (0, execute_detached_1.executeDetachedWithLogs)("qemu-system-aarch64", args, (0, path_1.join)(this.projectPath, bolt_vm_1.BOLTVM.LOG_FOLDER), {
                    shell: true,
                }, "qemu");
            });
        }
        static connect(portNumber = 2222) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(chalk_1.default.yellow(">> Initiating connection..."));
                const conn = yield (0, connect_to_vm_1.connecToVm)(portNumber);
                console.log(chalk_1.default.green(">> Connection established..."));
                return conn;
            });
        }
        static connectOnce(portNumber = 2222) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(chalk_1.default.yellow(">> Initiating connection..."));
                const conn = yield (0, connect_to_vm_1.connectToVmOnce)(portNumber);
                console.log(chalk_1.default.green(">> Connection established..."));
                return conn;
            });
        }
        static create(projectPath, containerPath, sshPort) {
            return __awaiter(this, void 0, void 0, function* () {
                const vm = new Vm(projectPath, containerPath, sshPort);
                return yield vm.boot();
            });
        }
        static destroy(processId) {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, kill_process_1.killProcess)(processId);
            });
        }
    }
    exports.default = Vm;
});
