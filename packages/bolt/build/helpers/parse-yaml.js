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
        define(["require", "exports", "yaml", "./exit-with-msg", "./fs-readfile"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseYAML = void 0;
    const yaml_1 = require("yaml");
    const exit_with_msg_1 = require("./exit-with-msg");
    const fs_readfile_1 = require("./fs-readfile");
    const parseYAML = (filepath) => __awaiter(void 0, void 0, void 0, function* () {
        const content = yield (0, fs_readfile_1.readfile)(filepath);
        try {
            const parsed = (0, yaml_1.parse)(content);
            return parsed;
        }
        catch (error) {
            if (error instanceof yaml_1.YAMLParseError || error instanceof yaml_1.YAMLWarning) {
                yield (0, exit_with_msg_1.exitWithMsg)(JSON.stringify(Object.assign({}, error), null, 2));
            }
            return `>> ${filepath} is not a valid yaml file`;
        }
    });
    exports.parseYAML = parseYAML;
});
