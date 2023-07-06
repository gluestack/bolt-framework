var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
        define(["require", "exports", "fs-extra", "path", "../helpers/generate-routes", "../helpers/validate-metadata", "../helpers/validate-services", "../common", "../constants/bolt-configs", "../libraries/ingress", "../helpers/get-store-data", "./service-up", "chalk", "@gluestack/boltvm", "../helpers/update-store"], factory);
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
    const boltvm_1 = __importDefault(require("@gluestack/boltvm"));
    const update_store_1 = require("../helpers/update-store");
    class Up {
        handle(options) {
            var _a, e_1, _b, _c;
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
                const localRunners = ["local", "docker"];
                const vmRunners = ["vmlocal", "vmdocker"];
                let isVmPresent = false;
                try {
                    for (var _d = true, _e = __asyncValues(Object.entries(_yamlContent.services)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                        _c = _f.value;
                        _d = false;
                        try {
                            const [serviceName, service] = _c;
                            if (data[serviceName] && data[serviceName].status !== "down") {
                                continue;
                            }
                            // Validating and getting content from bolt.service.yaml
                            const { content } = yield common_1.default.getAndValidateService(serviceName, _yamlContent);
                            if (content.default_service_runner === "vmlocal" ||
                                content.default_service_runner === "vmdocker") {
                                isVmPresent = true;
                                break;
                            }
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (isVmPresent) {
                    const cache = options.cache || false;
                    const boltVm = new boltvm_1.default(process.cwd());
                    yield boltVm.create(cache);
                    yield (0, update_store_1.updateStore)("vm", "up");
                }
                Object.entries(_yamlContent.services).forEach(([serviceName]) => __awaiter(this, void 0, void 0, function* () {
                    if (data[serviceName] && data[serviceName].status !== "down") {
                        return;
                    }
                    // Validating and getting content from bolt.service.yaml
                    const { content } = yield common_1.default.getAndValidateService(serviceName, _yamlContent);
                    const { default_service_runner, supported_service_runners } = content;
                    let prepared_service_runner = default_service_runner;
                    if (projectRunnerOption === "host") {
                        if (!supported_service_runners.includes("local") &&
                            !supported_service_runners.includes("docker")) {
                            console.log(chalk_1.default.red(`>> ${serviceName} does not includes host service runners. Skipping...`));
                            return;
                        }
                        else {
                            const availableRunners = supported_service_runners.filter((e) => !vmRunners.includes(e));
                            prepared_service_runner = availableRunners[0];
                        }
                    }
                    if (projectRunnerOption === "vm") {
                        if (!supported_service_runners.includes("vmlocal") &&
                            !supported_service_runners.includes("vmdocker")) {
                            console.log(chalk_1.default.red(`>> ${serviceName} does not includes vm service runners. Skipping...`));
                            return;
                        }
                        else {
                            const availableRunners = supported_service_runners.filter((e) => !localRunners.includes(e));
                            prepared_service_runner = availableRunners[0];
                        }
                    }
                    const serviceUp = new service_up_1.default();
                    serviceUpPromises.push(serviceUp.handle(serviceName, {
                        serviceRunner: prepared_service_runner,
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
