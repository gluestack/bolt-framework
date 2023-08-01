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
        define(["require", "exports", "chalk", "path", "../helpers/fs-exists", "../helpers/validate-metadata", "../helpers/validate-services", "../common", "../libraries/ingress", "../constants/bolt-configs", "../helpers/get-store-data", "./service-down", "../runners/service/vm", "../helpers/update-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const path_1 = require("path");
    const fs_exists_1 = require("../helpers/fs-exists");
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    const common_1 = __importDefault(require("../common"));
    const ingress_1 = __importDefault(require("../libraries/ingress"));
    const bolt_configs_1 = require("../constants/bolt-configs");
    const get_store_data_1 = require("../helpers/get-store-data");
    const service_down_1 = __importDefault(require("./service-down"));
    const vm_1 = __importDefault(require("../runners/service/vm"));
    const update_store_1 = require("../helpers/update-store");
    class Down {
        handle() {
            return __awaiter(this, void 0, void 0, function* () {
                const _yamlContent = yield common_1.default.getAndValidateBoltYaml();
                // Validations for metadata and services
                yield (0, validate_metadata_1.validateMetadata)();
                yield (0, validate_services_1.validateServices)();
                console.log(`>> Stopping ${_yamlContent.project_name}...`);
                const data = yield (0, get_store_data_1.getStoreData)("services");
                const serviceDownPromises = [];
                Object.entries(_yamlContent.services).forEach(([serviceName]) => __awaiter(this, void 0, void 0, function* () {
                    if (data[serviceName] && data[serviceName].status === "down") {
                        return;
                    }
                    const serviceDown = new service_down_1.default();
                    serviceDownPromises.push(serviceDown.handle(serviceName));
                }));
                yield Promise.all(serviceDownPromises);
                const vmStatus = yield (0, get_store_data_1.getStoreData)("vm");
                if (vmStatus === "up") {
                    yield vm_1.default.down();
                    yield (0, update_store_1.updateStore)("vm", "down");
                }
                // 3. stops the nginx container if it is running
                if (_yamlContent.ingress) {
                    const nginxConfig = (0, path_1.join)(process.cwd(), bolt_configs_1.BOLT.NGINX_CONFIG_FILE_NAME);
                    if (yield (0, fs_exists_1.exists)(nginxConfig)) {
                        yield ingress_1.default.stop(bolt_configs_1.BOLT.NGINX_CONTAINER_NAME);
                    }
                }
                (0, update_store_1.updateStoreRootData)("ports", []);
                console.log(chalk_1.default.green(`>> ${_yamlContent.project_name} is down.\n`));
            });
        }
    }
    exports.default = Down;
});
