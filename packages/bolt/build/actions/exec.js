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
        define(["require", "exports", "../common", "../helpers/exit-with-msg", "../helpers/get-store-data", "../helpers/validate-metadata", "../helpers/validate-services", "../runners/service/vm"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const common_1 = __importDefault(require("../common"));
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const get_store_data_1 = require("../helpers/get-store-data");
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    const vm_1 = __importDefault(require("../runners/service/vm"));
    class Exec {
        validateBoltYaml() {
            return __awaiter(this, void 0, void 0, function* () {
                //Validate bolt.yaml file
                const _yamlContent = yield common_1.default.getAndValidateBoltYaml();
                return { _yamlContent };
            });
        }
        validateMetadataForVM(_yamlContent) {
            return __awaiter(this, void 0, void 0, function* () {
                const vmStatus = yield (0, get_store_data_1.getStoreData)("vm");
                if (vmStatus !== "up") {
                    (0, exit_with_msg_1.exitWithMsg)(`VM is not running. Please run bolt vm up`);
                }
            });
        }
        handle() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const { _yamlContent } = yield this.validateBoltYaml();
                    // Validations for metadata and services
                    yield (0, validate_metadata_1.validateMetadata)();
                    yield (0, validate_services_1.validateServices)();
                    this.validateMetadataForVM(_yamlContent);
                    yield vm_1.default.exec();
                }
                catch (error) {
                    (0, exit_with_msg_1.exitWithMsg)("Error occured executing bolt exec: ", error.message);
                }
            });
        }
    }
    exports.default = Exec;
});
