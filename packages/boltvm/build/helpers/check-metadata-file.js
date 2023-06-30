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
        define(["require", "exports", "os", "path", "../constants/bolt-vm", "./fs-exists", "./fs-mkdir", "./fs-writefile", "./exit-with-msg"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkMetadataFile = void 0;
    const os_1 = __importDefault(require("os"));
    const path_1 = require("path");
    const bolt_vm_1 = require("../constants/bolt-vm");
    const fs_exists_1 = require("./fs-exists");
    const fs_mkdir_1 = require("./fs-mkdir");
    const fs_writefile_1 = require("./fs-writefile");
    const exit_with_msg_1 = require("./exit-with-msg");
    const checkMetadataFile = () => __awaiter(void 0, void 0, void 0, function* () {
        const metaDataDirectory = (0, path_1.join)(os_1.default.homedir(), bolt_vm_1.BOLTVM.METADATA_FOLDER);
        const metaDataFile = (0, path_1.join)(metaDataDirectory, bolt_vm_1.BOLTVM.METADATA_FILE);
        try {
            if (!(yield (0, fs_exists_1.exists)(metaDataDirectory))) {
                yield (0, fs_mkdir_1.createFolder)(metaDataDirectory);
            }
            if (!(yield (0, fs_exists_1.exists)(metaDataFile))) {
                yield (0, fs_writefile_1.writefile)(metaDataFile, JSON.stringify({
                    projects: {},
                }));
            }
        }
        catch (error) {
            (0, exit_with_msg_1.exitWithMsg)(`Error in validating ${metaDataFile}`, error);
        }
    });
    exports.checkMetadataFile = checkMetadataFile;
});
