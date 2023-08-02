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
        define(["require", "exports", "path", "lodash", "@gluestack/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = require("path");
    const lodash_1 = require("lodash");
    const helpers_1 = require("@gluestack/helpers");
    /**
     * Env
     *
     * This class is responsible for generating the .env file
     * in your gluestack app
     */
    class Env {
        constructor(envContent, routes = [], isProd = false) {
            this.keys = envContent;
            routes.map((route) => {
                const server = route.domain.split(".")[0] || "";
                if (!this.keys[`ENDPOINT_${server.toUpperCase()}`]) {
                    this.keys[`ENDPOINT_${server.toUpperCase()}`] = `http://localhost:${route.port}`;
                }
            });
            this.isProd = isProd;
            this.keyCharacter = "%";
            this.envs = [];
            this.filepath = (0, path_1.join)(process.cwd(), ".env");
        }
        // Adds router.js data to the nginx conf data
        // if and only if the given path exists
        addEnv(serviceName, envContent, path) {
            var _a, e_1, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                const previousContent = yield (0, helpers_1.envToJson)((0, path_1.join)(process.cwd(), ".env"));
                if (!this.isProd) {
                    this.keys = Object.assign(Object.assign({}, this.keys), previousContent);
                }
                try {
                    for (var _d = true, _e = __asyncValues(Object.keys(envContent)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                        _c = _f.value;
                        _d = false;
                        try {
                            const key = _c;
                            this.keys[(0, helpers_1.getCrossEnvKey)(serviceName, key)] = envContent[key];
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
                const childEnv = new ChildEnv((0, helpers_1.getPrefix)(serviceName), serviceName, envContent, path);
                this.envs.push(childEnv);
            });
        }
        // Generates the .env file
        generate() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    for (const key in this.keys) {
                        const prefix = key.split("_")[0];
                        const replaceKeys = this.getReplaceKeys(this.keys[key]);
                        for (const replaceKey of replaceKeys) {
                            this.keys[key] = this.keys[key].replaceAll(`${this.keyCharacter}${replaceKey}${this.keyCharacter}`, this.keys[replaceKey] ||
                                `${this.keyCharacter}${replaceKey}${this.keyCharacter}`);
                            const childEnv = (0, lodash_1.find)(this.envs, { prefix: prefix });
                            if (childEnv) {
                                childEnv.updateKey(key.replace(new RegExp("^" + `${prefix}_`), ""), this.keys[key]);
                            }
                        }
                    }
                    yield this.writeEnv();
                }
                catch (err) {
                    console.log(">> .env file creation failed due to following reasons -");
                    console.log(err);
                }
            });
        }
        writeEnv() {
            return __awaiter(this, void 0, void 0, function* () {
                for (const childEnv of this.envs) {
                    if (childEnv.filepath === this.filepath) {
                        this.keys = Object.assign(Object.assign({}, this.keys), childEnv.keys);
                    }
                    else {
                        yield childEnv.writeEnv();
                    }
                }
                const env = (0, helpers_1.jsonToEnv)(this.keys);
                yield (0, helpers_1.writeFile)(this.filepath, env);
            });
        }
        getReplaceKeys(str) {
            if (!str.includes(this.keyCharacter)) {
                return [];
            }
            const specialChar = "%";
            let startIdx = str.indexOf(specialChar);
            let endIdx = str.indexOf(specialChar, startIdx + 1);
            const result = [];
            while (startIdx !== -1 && endIdx !== -1) {
                const substring = str.substring(startIdx + 1, endIdx);
                result.push(substring);
                const nextStartIdx = str.indexOf(specialChar, endIdx + 1);
                startIdx = endIdx;
                endIdx = nextStartIdx;
            }
            return result;
        }
    }
    exports.default = Env;
    class ChildEnv {
        constructor(prefix, serviceName, keys, path) {
            this.prefix = prefix;
            this.serviceName = serviceName;
            this.keys = keys;
            this.filepath = (0, path_1.join)(path, ".env");
        }
        updateKey(key, value) {
            this.keys[key] = value;
        }
        writeEnv() {
            return __awaiter(this, void 0, void 0, function* () {
                const env = (0, helpers_1.jsonToEnv)(this.keys);
                if (env) {
                    yield (0, helpers_1.writeFile)(this.filepath, env);
                }
            });
        }
    }
});
