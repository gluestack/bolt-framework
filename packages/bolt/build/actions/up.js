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
        define(["require", "exports", "fs-extra", "path", "../helpers/generate-routes", "../helpers/validate-metadata", "../helpers/validate-services", "../common", "../constants/bolt-configs", "../libraries/ingress", "../helpers/get-store-data", "./service-up", "chalk"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_extra_1 = require("fs-extra");
    const path_1 = require("path");
    const generate_routes_1 = __importDefault(require("../helpers/generate-routes"));
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    const common_1 = __importDefault(require("../common"));
    const bolt_configs_1 = require("../constants/bolt-configs");
    const ingress_1 = __importDefault(require("../libraries/ingress"));
    const get_store_data_1 = require("../helpers/get-store-data");
    const service_up_1 = __importDefault(require("./service-up"));
    const chalk_1 = __importDefault(require("chalk"));
    class Up {
        handle(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let projectRunnerOption = "default";
                const cache = options.cache || false;
                if (options.host || options.vm) {
                    projectRunnerOption = options.host ? "host" : "vm";
                }
                const _yamlContent = yield common_1.default.getAndValidateBoltYaml();
                // Validations for metadata and services
                yield (0, validate_metadata_1.validateMetadata)();
                yield (0, validate_services_1.validateServices)();
                // 1. generates routes
                console.log(`>> Creating Ingress...`);
                const ports = yield (0, generate_routes_1.default)(_yamlContent);
                const data = yield (0, get_store_data_1.getStoreData)("services");
                const serviceUpPromises = [];
                const localRunner = ["local", "docker"];
                const vmRunners = ["vmlocal", "vmdocker"];
                Object.entries(_yamlContent.services).forEach(([serviceName]) => __awaiter(this, void 0, void 0, function* () {
                    if (data[serviceName] && data[serviceName].status !== "down") {
                        return;
                    }
                    // Validating and getting content from bolt.service.yaml
                    const { content } = yield common_1.default.getAndValidateService(serviceName, _yamlContent);
                    if (projectRunnerOption === "host" &&
                        !localRunner.includes(content.default_service_runner)) {
                        console.log(chalk_1.default.red(`>> ${serviceName} does not includes host runners. Skipping...`));
                        return;
                    }
                    if (projectRunnerOption === "vm" &&
                        !vmRunners.includes(content.default_service_runner)) {
                        console.log(chalk_1.default.red(`>> ${serviceName} does not includes vm runners. Skipping...`));
                        return;
                    }
                    const serviceRunner = content.default_service_runner;
                    const serviceUp = new service_up_1.default();
                    serviceUpPromises.push(serviceUp.handle(serviceName, {
                        serviceRunner,
                        cache: cache,
                        ports,
                    }));
                }));
                yield Promise.all(serviceUpPromises);
                // 2. generates .env
                yield common_1.default.generateEnv();
                // 5. starts nginx if the project runner is not vm and nginx config exists in bolt.yaml
                if (_yamlContent.ingress) {
                    const nginxConfig = (0, path_1.join)(process.cwd(), bolt_configs_1.BOLT.NGINX_CONFIG_FILE_NAME);
                    if (yield (0, fs_extra_1.exists)(nginxConfig)) {
                        yield ingress_1.default.start(bolt_configs_1.BOLT.NGINX_CONTAINER_NAME, ports, `${nginxConfig}:/etc/nginx/nginx.conf`, "nginx:latest");
                    }
                }
            });
        }
    }
    exports.default = Up;
});
