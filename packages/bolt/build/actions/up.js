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
        define(["require", "exports", "fs-extra", "path", "../helpers/generate-routes", "../helpers/validate-metadata", "../helpers/validate-services", "../common", "../constants/bolt-configs", "../libraries/ingress", "../helpers/get-store-data", "./service-up", "chalk", "@gluestack/boltvm", "../helpers/update-store", "../helpers/exit-with-msg"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateDependencies = void 0;
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
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const validateDependencies = (arr, arb) => __awaiter(void 0, void 0, void 0, function* () {
        const arrSet = new Set(arr);
        for (const value of arb) {
            if (!arrSet.has(value)) {
                yield (0, exit_with_msg_1.exitWithMsg)(`>> Error: '${value}' is not a valid service name to depend on`);
            }
        }
    });
    exports.validateDependencies = validateDependencies;
    function sortObjectsByDependencies(jsonObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const visited = {};
            const sortedObjects = [];
            function visit(nodeKey, inProgress = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (inProgress[nodeKey]) {
                        yield (0, exit_with_msg_1.exitWithMsg)(`Circular dependency detected in ${nodeKey}!`);
                    }
                    if (visited[nodeKey])
                        return;
                    inProgress[nodeKey] = true;
                    const node = jsonObject[nodeKey];
                    if (node.depends_on) {
                        for (const dependency of node.depends_on) {
                            visit(dependency, Object.assign({}, inProgress)); // Pass a copy of inProgress to avoid modification
                        }
                    }
                    visited[nodeKey] = true;
                    sortedObjects.push(node);
                });
            }
            for (const key in jsonObject) {
                yield visit(key);
            }
            return sortedObjects;
        });
    }
    class Up {
        handle(options) {
            var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j;
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
                const data = yield (0, get_store_data_1.getStoreData)("services");
                const localRunners = ["local", "docker"];
                const vmRunners = ["vmlocal", "vmdocker"];
                // TODO: Sort services based on their dependencies
                const validServices = Object.keys(_yamlContent.services);
                let tree = {};
                try {
                    for (var _k = true, _l = __asyncValues(Object.entries(_yamlContent.services)), _m; _m = yield _l.next(), _a = _m.done, !_a;) {
                        _c = _m.value;
                        _k = false;
                        try {
                            const [serviceName, service] = _c;
                            // Validating and getting content from bolt.service.yaml
                            const { content } = yield common_1.default.getAndValidateService(serviceName, _yamlContent);
                            if (content.depends_on) {
                                yield (0, exports.validateDependencies)(validServices, content.depends_on);
                            }
                            tree[serviceName] = Object.assign({}, content);
                        }
                        finally {
                            _k = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_k && !_a && (_b = _l.return)) yield _b.call(_l);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                const sortedTree = yield sortObjectsByDependencies(tree);
                let isVmPresent = false;
                try {
                    for (var _o = true, sortedTree_1 = __asyncValues(sortedTree), sortedTree_1_1; sortedTree_1_1 = yield sortedTree_1.next(), _d = sortedTree_1_1.done, !_d;) {
                        _f = sortedTree_1_1.value;
                        _o = false;
                        try {
                            const service = _f;
                            const serviceName = service.container_name;
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
                            _o = true;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_o && !_d && (_e = sortedTree_1.return)) yield _e.call(sortedTree_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                if (isVmPresent) {
                    const cache = options.cache || false;
                    const boltVm = new boltvm_1.default(process.cwd());
                    yield boltVm.create(cache);
                    yield (0, update_store_1.updateStore)("vm", "up");
                }
                try {
                    for (var _p = true, sortedTree_2 = __asyncValues(sortedTree), sortedTree_2_1; sortedTree_2_1 = yield sortedTree_2.next(), _g = sortedTree_2_1.done, !_g;) {
                        _j = sortedTree_2_1.value;
                        _p = false;
                        try {
                            const service = _j;
                            const serviceName = service.container_name;
                            if (data[serviceName] && data[serviceName].status !== "down") {
                                continue;
                            }
                            // Validating and getting content from bolt.service.yaml
                            const { content } = yield common_1.default.getAndValidateService(serviceName, _yamlContent);
                            const { default_service_runner, supported_service_runners } = content;
                            let prepared_service_runner = default_service_runner;
                            if (projectRunnerOption === "host") {
                                if (!supported_service_runners.includes("local") &&
                                    !supported_service_runners.includes("docker")) {
                                    console.log(chalk_1.default.red(`>> ${serviceName} does not includes host service runners. Skipping...`));
                                    continue;
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
                                    continue;
                                }
                                else {
                                    const availableRunners = supported_service_runners.filter((e) => !localRunners.includes(e));
                                    prepared_service_runner = availableRunners[0];
                                }
                            }
                            const serviceUp = new service_up_1.default();
                            yield serviceUp.handle(serviceName, {
                                serviceRunner: prepared_service_runner,
                                cache: cache,
                            });
                        }
                        finally {
                            _p = true;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (!_p && !_g && (_h = sortedTree_2.return)) yield _h.call(sortedTree_2);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                // 1. generates routes
                console.log(`>> Creating Ingress...`);
                const ports = yield (0, generate_routes_1.default)(_yamlContent);
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
