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
        define(["require", "exports", "../../helpers/exit-with-msg", "../../helpers/update-store", "./docker", "./local"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const exit_with_msg_1 = require("../../helpers/exit-with-msg");
    const update_store_1 = require("../../helpers/update-store");
    const docker_1 = __importDefault(require("./docker"));
    const local_1 = __importDefault(require("./local"));
    class ServiceRunner {
        local(configs, option) {
            return __awaiter(this, void 0, void 0, function* () {
                const { servicePath, build, isFollow, processId, serviceName } = configs;
                const serviceRunnerLocal = new local_1.default(servicePath, build);
                const { action } = option;
                switch (action) {
                    case "start":
                        const PID = yield serviceRunnerLocal.start(serviceName);
                        // Update store
                        const json = {
                            status: "up",
                            serviceRunner: "local",
                            port: null,
                            processId: PID,
                        };
                        yield (0, update_store_1.updateStore)("services", serviceName, json);
                        yield (0, update_store_1.updateStore)("project_runner", "host");
                        break;
                    case "stop":
                        yield serviceRunnerLocal.stop(processId);
                        break;
                    case "logs":
                        yield serviceRunnerLocal.logs(isFollow, serviceName);
                        break;
                    default:
                        (0, exit_with_msg_1.exitWithMsg)("Unknown action");
                        break;
                }
            });
        }
        docker(configs, option) {
            return __awaiter(this, void 0, void 0, function* () {
                const { containerName, servicePath, build, ports, envFile, volumes, isFollow, } = configs;
                const serviceRunnerDocker = new docker_1.default(containerName, servicePath, build, ports, envFile, volumes);
                const { action, serviceName } = option;
                switch (action) {
                    case "start":
                        yield serviceRunnerDocker.start();
                        // Update store
                        const json = {
                            status: "up",
                            serviceRunner: "docker",
                            port: ports,
                            processId: containerName,
                        };
                        yield (0, update_store_1.updateStore)("services", serviceName || "", json);
                        yield (0, update_store_1.updateStore)("project_runner", "host");
                        break;
                    case "stop":
                        yield serviceRunnerDocker.stop();
                        break;
                    case "logs":
                        yield serviceRunnerDocker.logs(isFollow);
                        break;
                    default:
                        (0, exit_with_msg_1.exitWithMsg)(`Unknown action: ${action}`);
                        break;
                }
            });
        }
    }
    exports.default = ServiceRunner;
});
