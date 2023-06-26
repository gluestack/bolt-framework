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
        define(["require", "exports", "@gluestack/helpers", "path", "../common", "../helpers/fs-exists", "../helpers/validate-metadata", "../helpers/validate-services", "../libraries/env"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const helpers_1 = require("@gluestack/helpers");
    const path_1 = require("path");
    const common_1 = __importDefault(require("../common"));
    const fs_exists_1 = require("../helpers/fs-exists");
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    const env_1 = __importDefault(require("../libraries/env"));
    class EnvGenerate {
        handle({ build }) {
            var _a, e_1, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                const _yamlContent = yield common_1.default.getAndValidateBoltYaml();
                // Validations for metadata and services
                yield (0, validate_metadata_1.validateMetadata)();
                yield (0, validate_services_1.validateServices)();
                const ingress = _yamlContent.ingress || [];
                const env = new env_1.default(yield (0, helpers_1.envToJson)((0, path_1.join)(process.cwd(), ".env.tpl")), build, ingress);
                try {
                    // Gather all the availables services
                    for (var _d = true, _e = __asyncValues(Object.entries(_yamlContent.services)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                        _c = _f.value;
                        _d = false;
                        try {
                            const [serviceName, service] = _c;
                            const { servicePath } = yield common_1.default.getAndValidateService(serviceName, _yamlContent);
                            const _envPath = yield (0, fs_exists_1.exists)((0, path_1.join)(servicePath, ".env.tpl"));
                            let _envJson = {};
                            if (typeof _envPath === "string") {
                                _envJson = yield (0, helpers_1.envToJson)(_envPath);
                            }
                            yield env.addEnv(serviceName, _envJson, servicePath);
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
