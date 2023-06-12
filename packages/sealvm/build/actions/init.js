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
        define(["require", "exports", "js-yaml", "chalk", "path", "../constants", "../helpers/fs-exists", "../helpers/fs-writefile", "../helpers/exit-with-msg", "../helpers/update-store", "../helpers/check-metadata-file", "../helpers/remove-special-characters"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const js_yaml_1 = __importDefault(require("js-yaml"));
    const chalk_1 = __importDefault(require("chalk"));
    const path_1 = require("path");
    const constants_1 = require("../constants");
    const fs_exists_1 = require("../helpers/fs-exists");
    const fs_writefile_1 = require("../helpers/fs-writefile");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const update_store_1 = require("../helpers/update-store");
    const check_metadata_file_1 = require("../helpers/check-metadata-file");
    const remove_special_characters_1 = require("../helpers/remove-special-characters");
    function YamlContent(localPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Object.assign({ name: (0, remove_special_characters_1.removeSpecialCharacters)((0, path_1.basename)(localPath)), source: localPath }, constants_1.YAMLDATA);
            return js_yaml_1.default.dump(data);
        });
    }
    function createProject(sealConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = {
                path: sealConfig.source,
                containerPath: "",
                sshPort: null,
                status: "down",
                vmProcessId: null,
                mountProcessId: null,
                sshProcessIds: null,
                projectRunnerId: null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
            yield (0, update_store_1.updateStore)("projects", sealConfig.name, json);
        });
    }
    exports.default = (localPath) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            localPath =
                localPath === "." ? process.cwd() : (0, path_1.join)(process.cwd(), localPath);
            // Validate Path
            if (!(yield (0, fs_exists_1.exists)(localPath))) {
                (0, exit_with_msg_1.exitWithMsg)(">> Please specify correct path to initialize");
                return;
            }
            // Validate if Sealfile already exists
            if (yield (0, fs_exists_1.exists)((0, path_1.join)(localPath, constants_1.SEALVM.CONFIG_FILE))) {
                (0, exit_with_msg_1.exitWithMsg)(`>> ${constants_1.SEALVM.CONFIG_FILE} already exists`);
                return;
            }
            // Get Yaml Content
            const yamlContent = yield YamlContent(localPath);
            // Create Sealfile
            yield (0, fs_writefile_1.writefile)((0, path_1.join)(localPath, constants_1.SEALVM.CONFIG_FILE), yamlContent);
            // Create SealVM Metadata
            yield (0, check_metadata_file_1.checkMetadataFile)();
            // Create project
            const projectConfig = js_yaml_1.default.load(yamlContent);
            yield createProject(projectConfig);
            console.log(`>> Installed ${constants_1.SEALVM.CONFIG_FILE} in ${chalk_1.default.green(localPath)}`);
        }
        catch (error) {
            (0, exit_with_msg_1.exitWithMsg)(`Error while creating ${constants_1.SEALVM.CONFIG_FILE}`, error.message);
        }
    });
});
