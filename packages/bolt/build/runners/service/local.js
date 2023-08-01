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
        define(["require", "exports", "path", "chalk", "../../helpers/execute-detached", "../../helpers/kill-process", "../../helpers/get-local-logs", "../../helpers/update-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = require("path");
    const chalk_1 = __importDefault(require("chalk"));
    const execute_detached_1 = require("../../helpers/execute-detached");
    const kill_process_1 = require("../../helpers/kill-process");
    const get_local_logs_1 = require("../../helpers/get-local-logs");
    const update_store_1 = require("../../helpers/update-store");
    class ServiceRunnerLocal {
        constructor(serviceName, servicePath, build, ports) {
            this.serviceName = serviceName;
            this.build = build;
            this.volume = (0, path_1.join)(servicePath);
            this.ports = ports;
        }
        run(serviceName) {
            return __awaiter(this, void 0, void 0, function* () {
                const args = ["-c", `'${this.build}'`];
                this.printCommand(args);
                return (0, execute_detached_1.executeDetached)("sh", args, this.volume, {
                    cwd: this.volume,
                    shell: true,
                }, serviceName);
            });
        }
        printCommand(args) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(chalk_1.default.gray("$ sh", args.join(" ")));
            });
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                const PID = yield this.run(this.serviceName);
                const json = {
                    status: "up",
                    serviceRunner: "local",
                    projectRunner: "host",
                    port: this.ports,
                    processId: PID,
                };
                yield (0, update_store_1.updateStore)("services", this.serviceName, json);
            });
        }
        stop(processId) {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, kill_process_1.killProcess)(processId);
                const json = {
                    status: "down",
                    serviceRunner: null,
                    projectRunner: null,
                    port: null,
                    processId: null,
                };
                yield (0, update_store_1.updateStore)("services", this.serviceName, json);
            });
        }
        logs(isFollow) {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, get_local_logs_1.getLogs)(this.serviceName, isFollow, (0, path_1.join)(".logs", this.serviceName));
            });
        }
    }
    exports.default = ServiceRunnerLocal;
});
