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
        define(["require", "exports", "@gluestack/helpers", "path", "../helpers/fs-writefile", "../libraries/env", "../libraries/service-discovery", "../common", "./port-discovery"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const helpers_1 = require("@gluestack/helpers");
    const path_1 = require("path");
    const fs_writefile_1 = require("../helpers/fs-writefile");
    const env_1 = __importDefault(require("../libraries/env"));
    const service_discovery_1 = __importDefault(require("../libraries/service-discovery"));
    const common_1 = __importDefault(require("../common"));
    const port_discovery_1 = __importDefault(require("./port-discovery"));
    class EnvGenerate {
        handle({ environment, serviceInfo, }) {
            return __awaiter(this, void 0, void 0, function* () {
                switch (environment) {
                    case "local":
                        yield this.local(serviceInfo);
                        break;
                    case "production":
                        yield this.production();
                        break;
                }
                return;
            });
        }
        local(serviceInfo) {
            return __awaiter(this, void 0, void 0, function* () {
                // Gathering all contants
                const { servicePath, serviceName } = serviceInfo;
                const _yamlContent = yield common_1.default.getAndValidateBoltYaml();
                const ingress = _yamlContent.ingress || [];
                const env = new env_1.default(yield (0, helpers_1.envToJson)((0, path_1.join)(process.cwd(), ".env.tpl")), ingress);
                // Reading the .env.tpl
                let serviceEnvJSON = yield (0, helpers_1.envToJson)((0, path_1.join)(servicePath, ".env.tpl"));
                // Adding assigned ports and assigned hosts to the .env.tpl
                let envTplContent = (0, helpers_1.jsonToEnv)(Object.assign(Object.assign(Object.assign({}, serviceEnvJSON), { ["ASSIGNED_HOST"]: "localhost" }), (serviceInfo.ports || {})));
                // Writing the updated .env.tpl
                yield (0, fs_writefile_1.writefile)((0, path_1.join)(servicePath, ".env.tpl"), envTplContent);
                // Reading values from updated .env.tpl and generating env from that
                serviceEnvJSON = yield (0, helpers_1.envToJson)((0, path_1.join)(servicePath, ".env.tpl"));
                yield env.addEnv(serviceName, serviceEnvJSON, servicePath);
                yield env.generate();
            });
        }
        production() {
            var _a, e_1, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                const _yamlContent = yield common_1.default.getAndValidateBoltYaml();
                const ingress = _yamlContent.ingress || [];
                const env = new env_1.default(yield (0, helpers_1.envToJson)((0, path_1.join)(process.cwd(), ".env.tpl")), ingress, true);
                try {
                    // Gather all the availables services
                    for (var _d = true, _e = __asyncValues(Object.entries(_yamlContent.services)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                        _c = _f.value;
                        _d = false;
                        try {
                            const [serviceName] = _c;
                            const { servicePath, content } = yield common_1.default.getAndValidateService(serviceName, _yamlContent);
                            let serviceEnvJSON = yield (0, helpers_1.envToJson)((0, path_1.join)(servicePath, ".env.tpl"));
                            const defaultEnv = Object.assign(Object.assign({}, serviceEnvJSON), { ["ASSIGNED_HOST"]: "localhost" });
                            const portDiscovery = new port_discovery_1.default(content);
                            const productionPorts = yield portDiscovery.production();
                            let envContent = (0, helpers_1.jsonToEnv)(Object.assign(Object.assign({}, defaultEnv), (productionPorts.ports || {})));
                            yield (0, fs_writefile_1.writefile)((0, path_1.join)(servicePath, ".env.tpl"), envContent);
                            serviceEnvJSON = yield (0, helpers_1.envToJson)((0, path_1.join)(servicePath, ".env.tpl"));
                            const productionHosts = yield service_discovery_1.default.discoverProductionHost(servicePath);
                            serviceEnvJSON = Object.assign(Object.assign({}, serviceEnvJSON), productionHosts);
                            yield env.addEnv(serviceName, serviceEnvJSON, servicePath);
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
                yield env.generate();
            });
        }
    }
    exports.default = EnvGenerate;
});
