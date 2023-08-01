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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@gluestack/helpers", "path", "./fs-writefile"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rewriteEnvViaRegExpression = void 0;
    const helpers_1 = require("@gluestack/helpers");
    const path_1 = require("path");
    const fs_writefile_1 = require("./fs-writefile");
    const rewriteEnvViaRegExpression = (servicePath, regularExpression, value) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const regex = new RegExp(regularExpression, "g");
        const envTplLocaltion = (0, path_1.join)(servicePath, ".env.tpl");
        const envLocation = (0, path_1.join)(servicePath, ".env");
        const envTplContent = yield (0, helpers_1.envToJson)(envTplLocaltion);
        let envContent = yield (0, helpers_1.envToJson)(envLocation);
        try {
            for (var _d = true, _e = __asyncValues(Object.keys(envTplContent)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                _c = _f.value;
                _d = false;
                try {
                    const key = _c;
                    if (envTplContent[key].match(regex)) {
                        envContent[key] = envContent[key].replace("localhost", value);
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
        envContent = (0, helpers_1.jsonToEnv)(envContent);
        yield (0, fs_writefile_1.writefile)(envLocation, envContent);
    });
    exports.rewriteEnvViaRegExpression = rewriteEnvViaRegExpression;
});
