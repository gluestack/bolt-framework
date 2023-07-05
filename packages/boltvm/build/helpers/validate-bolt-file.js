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
        define(["require", "exports", "path", "js-yaml", "./fs-exists", "./fs-readfile", "./exit-with-msg", "../constants/bolt"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateBoltYaml = void 0;
    const path_1 = require("path");
    const js_yaml_1 = __importDefault(require("js-yaml"));
    const fs_exists_1 = require("./fs-exists");
    const fs_readfile_1 = require("./fs-readfile");
    const exit_with_msg_1 = require("./exit-with-msg");
    const bolt_1 = require("../constants/bolt");
    const validateBoltYaml = (localPath) => __awaiter(void 0, void 0, void 0, function* () {
        const boltVmConfigPath = (0, path_1.join)(localPath, bolt_1.BOLT.CONFIG_FILE);
        if (!(yield (0, fs_exists_1.exists)(boltVmConfigPath))) {
            (0, exit_with_msg_1.exitWithMsg)(`${bolt_1.BOLT.CONFIG_FILE} File Does not exist`);
        }
        const boltYmlContent = yield (0, fs_readfile_1.readfile)(boltVmConfigPath);
        const boltConfigs = js_yaml_1.default.load(boltYmlContent);
        // if (!boltConfigs.vm) {
        //   exitWithMsg(`No configuration found for vm in ${BOLT.CONFIG_FILE}`);
        // }
        return boltConfigs;
    });
    exports.validateBoltYaml = validateBoltYaml;
});
