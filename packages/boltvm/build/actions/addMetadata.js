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
        define(["require", "exports", "../helpers/fs-exists", "../helpers/exit-with-msg", "../helpers/check-metadata-file", "../helpers/validate-bolt-file", "../common", "../constants/bolt"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_exists_1 = require("../helpers/fs-exists");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const check_metadata_file_1 = require("../helpers/check-metadata-file");
    const validate_bolt_file_1 = require("../helpers/validate-bolt-file");
    const common_1 = __importDefault(require("../common"));
    const bolt_1 = require("../constants/bolt");
    class AddMetadata {
        handle(localPath) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Validate Path
                    if (!(yield (0, fs_exists_1.exists)(localPath))) {
                        yield (0, exit_with_msg_1.exitWithMsg)(">> Please specify correct path in source");
                        return;
                    }
                    // Check for valid boltvm yml file
                    const boltConfig = yield (0, validate_bolt_file_1.validateBoltYaml)(localPath);
                    // Check metadata for boltvm
                    yield (0, check_metadata_file_1.checkMetadataFile)();
                    yield common_1.default.createProjectMetadata(boltConfig);
                }
                catch (error) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`Error while creating ${bolt_1.BOLT.CONFIG_FILE} ${error.message}`);
                }
            });
        }
    }
    exports.default = AddMetadata;
});
