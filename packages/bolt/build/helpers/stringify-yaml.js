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
        define(["require", "exports", "yaml", "./exit-with-msg", "./fs-writefile"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stringifyYAML = void 0;
    const yaml_1 = require("yaml");
    const exit_with_msg_1 = require("./exit-with-msg");
    const fs_writefile_1 = require("./fs-writefile");
    const stringifyYAML = (json, filepath) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parsed = (0, yaml_1.stringify)(json);
            yield (0, fs_writefile_1.writefile)(filepath, parsed);
        }
        catch (error) {
            if (error instanceof yaml_1.YAMLParseError || error instanceof yaml_1.YAMLWarning) {
                yield (0, exit_with_msg_1.exitWithMsg)(Object.assign({}, error));
            }
            return `> Error in Writing to ${filepath}, not a valid json`;
        }
    });
    exports.stringifyYAML = stringifyYAML;
});
