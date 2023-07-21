var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./fs-readfile"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_readfile_1 = require("./fs-readfile");
    const interpolateEnvVariables = (data, envFilePath) => __awaiter(void 0, void 0, void 0, function* () {
        const envContent = yield (0, fs_readfile_1.readfile)(envFilePath);
        if (!envContent) {
            return data;
        }
        const envVars = envContent
            .split('\n')
            .filter((line) => line.trim() && !line.trim().startsWith('#'))
            .map((line) => {
            const [key, value] = line.split('=');
            return { key: key.trim(), value: value.trim() };
        });
        const interpolateObject = (obj) => {
            if (typeof obj === 'string') {
                const regex = /\${(.+?)}/g;
                return obj.replace(regex, (_, varName) => {
                    const envVar = envVars.find(env => env.key === varName);
                    return envVar ? envVar.value : '';
                });
            }
            else if (Array.isArray(obj)) {
                return obj.map(item => interpolateObject(item));
            }
            else if (typeof obj === 'object') {
                const newObj = {};
                for (const key in obj) {
                    newObj[key] = interpolateObject(obj[key]);
                }
                return newObj;
            }
            else {
                return obj;
            }
        };
        return interpolateObject(data);
    });
    exports.default = interpolateEnvVariables;
});
