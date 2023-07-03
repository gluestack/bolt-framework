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
        define(["require", "exports", "../../helpers/exit-with-msg", "../../helpers/update-all-services-status", "../../helpers/update-store", "../../validations/bolt-vm", "@gluestack/boltvm", "../../common"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const exit_with_msg_1 = require("../../helpers/exit-with-msg");
    const update_all_services_status_1 = require("../../helpers/update-all-services-status");
    const update_store_1 = require("../../helpers/update-store");
    const bolt_vm_1 = require("../../validations/bolt-vm");
    const boltvm_1 = __importDefault(require("@gluestack/boltvm"));
    const common_1 = __importDefault(require("../../common"));
    class ProjectRunnerVm {
        constructor(_yamlContent) {
            this._yamlContent = _yamlContent;
            this.boltVM = new boltvm_1.default(process.cwd());
        }
        resolveServiceRunner(defaultServiceRunner, providedRunner) {
            if (providedRunner.includes(defaultServiceRunner)) {
                return defaultServiceRunner;
            }
            else {
                return providedRunner[0];
            }
        }
        updateStatusOfAllServices() {
            return __awaiter(this, void 0, void 0, function* () {
                const _yamlContent = this._yamlContent;
                const defaultServiceRunner = _yamlContent.default_service_runner;
                Object.entries(_yamlContent.services).forEach(([serviceName]) => __awaiter(this, void 0, void 0, function* () {
                    // Validating and getting content from bolt.service.yaml
                    const { content } = yield common_1.default.getAndValidateService(serviceName, _yamlContent);
                    const runner = this.resolveServiceRunner(defaultServiceRunner, Object.keys(content.service_runners));
                    const json = {
                        status: "up",
                        serviceRunner: runner,
                        port: null,
                        processId: null,
                    };
                    yield (0, update_store_1.updateStore)("services", serviceName, json);
                }));
            });
        }
        up(cache) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Validating boltVm Dependencies
                    yield this.boltVM.doctor();
                    const _yamlContent = this._yamlContent;
                    const vmConfig = _yamlContent.vm;
                    if (!vmConfig) {
                        (0, exit_with_msg_1.exitWithMsg)(`>> No vm config found in bolt.yaml`);
                        return;
                    }
                    //   const projectPath = vmConfig.source;
                    yield (0, bolt_vm_1.validateVmConfig)(vmConfig);
                    yield this.boltVM.create(cache);
                    // Updating the status of all services
                    yield this.updateStatusOfAllServices();
                    // Updating the store
                    yield (0, update_store_1.updateStore)("project_runner", "vm");
                    yield this.boltVM.run(true);
                }
                catch (error) {
                    (0, exit_with_msg_1.exitWithMsg)(`Error occured executing bolt up: ${error.message}`);
                }
            });
        }
        down() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Validating boltVm Dependencies
                    yield this.boltVM.doctor();
                    const yamlContent = this._yamlContent;
                    yield this.boltVM.down();
                    const json = {
                        status: "down",
                        serviceRunner: null,
                        port: null,
                        processId: null,
                    };
                    yield (0, update_all_services_status_1.updateAllServicesStatus)(yamlContent, json, { reset: false });
                    yield (0, update_store_1.updateStore)("project_runner", "none");
                }
                catch (error) {
                    (0, exit_with_msg_1.exitWithMsg)(`Error occured executing bolt down: ${error.message}`);
                }
            });
        }
        exec() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Validating boltVm Dependencies
                    yield this.boltVM.doctor();
                    yield this.boltVM.exec();
                }
                catch (error) {
                    (0, exit_with_msg_1.exitWithMsg)(`Error occured executing bolt exec: ${error.message}`);
                }
            });
        }
    }
    exports.default = ProjectRunnerVm;
});
