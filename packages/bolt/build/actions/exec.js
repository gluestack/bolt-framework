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
        define(["require", "exports", "../common", "../constants/bolt-configs", "../helpers/exit-with-msg", "../helpers/get-store", "../helpers/validate-metadata", "../helpers/validate-services", "../runners/project", "../validations/bolt-vm"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const common_1 = __importDefault(require("../common"));
    const bolt_configs_1 = require("../constants/bolt-configs");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const get_store_1 = __importDefault(require("../helpers/get-store"));
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    const project_1 = __importDefault(require("../runners/project"));
    const bolt_vm_1 = require("../validations/bolt-vm");
    class Exec {
        validateBoltYaml() {
            return __awaiter(this, void 0, void 0, function* () {
                //Validate bolt.yaml file
                const _yamlContent = yield common_1.default.getAndValidateBoltYaml();
                const vmServerConfig = _yamlContent.vm;
                if (!vmServerConfig) {
                    (0, exit_with_msg_1.exitWithMsg)(`VM server config not found in ${bolt_configs_1.BOLT.YAML_FILE_NAME}`);
                    process.exit();
                }
                const vmConfig = yield (0, bolt_vm_1.validateVmConfig)(vmServerConfig);
                return { _yamlContent, vmConfig };
            });
        }
        validateMetadataForVM(_yamlContent, projectRunner) {
            if (!projectRunner) {
                (0, exit_with_msg_1.exitWithMsg)("Either environment or server not found in metadata");
            }
            if (projectRunner === "none") {
                (0, exit_with_msg_1.exitWithMsg)(`${_yamlContent.project_name} is not running`);
            }
            if (projectRunner !== "vm") {
                (0, exit_with_msg_1.exitWithMsg)(`${_yamlContent.project_name} is running on host machine`);
            }
        }
        handle() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const { _yamlContent, vmConfig } = yield this.validateBoltYaml();
                    // Validations for metadata and services
                    yield (0, validate_metadata_1.validateMetadata)();
                    yield (0, validate_services_1.validateServices)();
                    const store = yield (0, get_store_1.default)();
                    const currentProjectRunner = yield store.get("project_runner");
                    this.validateMetadataForVM(_yamlContent, currentProjectRunner);
                    const projectRunner = new project_1.default(_yamlContent);
                    yield projectRunner.vm({ action: "exec" });
                }
                catch (error) {
                    (0, exit_with_msg_1.exitWithMsg)("Error occured executing bolt exec: ", error.message);
                }
            });
        }
    }
    exports.default = Exec;
});
