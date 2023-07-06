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
        define(["require", "exports", "@gluestack/boltvm", "../../helpers/update-store", "../../helpers/get-store-data", "chalk", "../../constants/bolt-configs", "../../helpers/exit-with-msg"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const boltvm_1 = __importDefault(require("@gluestack/boltvm"));
    const update_store_1 = require("../../helpers/update-store");
    const get_store_data_1 = require("../../helpers/get-store-data");
    const chalk_1 = __importDefault(require("chalk"));
    const bolt_configs_1 = require("../../constants/bolt-configs");
    const exit_with_msg_1 = require("../../helpers/exit-with-msg");
    class ServiceRunnerVM {
        constructor(serviceContent, serviceName, cache, runnerType) {
            this.boltVM = new boltvm_1.default(process.cwd());
            this.cache = cache;
            this.runnerType = runnerType;
            this.serviceContent = serviceContent;
            this.serviceName = serviceName;
        }
        getVmStatus() {
            return __awaiter(this, void 0, void 0, function* () {
                const vmStatus = yield (0, get_store_data_1.getStoreData)("vm");
                return vmStatus;
            });
        }
        exposePort(vmServiceRunnerType) {
            return __awaiter(this, void 0, void 0, function* () {
                const serviceRunner = this.serviceContent.service_runners;
                const ports = serviceRunner[vmServiceRunnerType].ports;
                if (!ports) {
                    console.log(chalk_1.default.red(`>> No ports defined in ${bolt_configs_1.BOLT.SERVICE_YAML_FILE_NAME} to expose`));
                    return;
                }
                // Exposing ports in vm
                yield this.boltVM.exposePort(ports);
                return ports;
            });
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Validating boltVm Dependencies
                    yield this.boltVM.doctor();
                    const vmStatus = yield this.getVmStatus();
                    if (!vmStatus || vmStatus !== "up") {
                        yield this.boltVM.create(this.cache);
                        yield (0, update_store_1.updateStore)("vm", "up");
                    }
                    // Command to start service in vm
                    const serviceUpBaseCommand = `bolt service:up ${this.serviceName} --service-runner`;
                    const vmServiceRunnerType = this.runnerType === "vmlocal" ? "local" : "docker";
                    // Running service in vm
                    yield this.boltVM.run(`${serviceUpBaseCommand} ${vmServiceRunnerType}`, true);
                    const ports = yield this.exposePort(vmServiceRunnerType);
                    // Updating store
                    const json = {
                        status: "up",
                        serviceRunner: this.runnerType,
                        projectRunner: "vm",
                        port: ports || null,
                        processId: null,
                    };
                    yield (0, update_store_1.updateStore)("services", this.serviceName, json);
                }
                catch (error) {
                    console.log(chalk_1.default.red(`Some error occured while running service ${this.serviceName} in VM: ${error.message}`));
                }
            });
        }
        stop() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Validating boltVm Dependencies
                    yield this.boltVM.doctor();
                    const vmStatus = yield this.getVmStatus();
                    if (!vmStatus || vmStatus !== "up") {
                        (0, exit_with_msg_1.exitWithMsg)(`>> Unable to stop ${this.serviceName} as VM is down`);
                    }
                    // Command to stop service in vm
                    const serviceDownCommand = `bolt service:down ${this.serviceName}`;
                    // Running service in vm
                    yield this.boltVM.executeCommand(`${serviceDownCommand}`, true);
                    // Updating store
                    const json = {
                        status: "down",
                        serviceRunner: null,
                        projectRunner: null,
                        port: null,
                        processId: null,
                    };
                    yield (0, update_store_1.updateStore)("services", this.serviceName, json);
                }
                catch (error) {
                    console.log(chalk_1.default.red(`>> Some error occured while stopping service ${this.serviceName} in VM: ${error.message}`));
                }
            });
        }
        logs(isFollow) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Validating boltVm Dependencies
                    yield this.boltVM.doctor();
                    const vmStatus = yield this.getVmStatus();
                    if (!vmStatus || vmStatus !== "up") {
                        (0, exit_with_msg_1.exitWithMsg)(`>> Unable to get logs for ${this.serviceName} as VM is down`);
                    }
                    // Command to stop service in vm
                    let servicelogCommand = `bolt log ${this.serviceName}`;
                    if (isFollow) {
                        servicelogCommand += " --follow";
                    }
                    // Running service in vm
                    yield this.boltVM.executeCommand(`${servicelogCommand}`, false);
                }
                catch (error) {
                    console.log(chalk_1.default.red(`>> Some error occured while getting logs for service ${this.serviceName} in VM: ${error.message}`));
                }
            });
        }
        static exec() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const boltVM = new boltvm_1.default(process.cwd());
                    // Validating boltVm Dependencies
                    yield boltVM.doctor();
                    yield boltVM.exec();
                }
                catch (error) {
                    (0, exit_with_msg_1.exitWithMsg)(`>> Error occured executing bolt exec: ${error.message}!`);
                }
            });
        }
        static down() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const boltVM = new boltvm_1.default(process.cwd());
                    // Validating boltVm Dependencies
                    yield boltVM.doctor();
                    yield boltVM.down();
                    yield (0, update_store_1.updateStore)("vm", "down");
                }
                catch (error) {
                    console.log(chalk_1.default.red(`>> Some error occured while stopping VM: ${error.message}`));
                }
            });
        }
    }
    exports.default = ServiceRunnerVM;
});
