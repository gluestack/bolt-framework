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
        define(["require", "exports", "path", "os", "lodash", "./fs-exists", "./fs-mkdir", "./fs-readfile-json", "./fs-writefile", "./exit-with-msg", "../common", "../constants/bolt-configs", "@gluestack/boltvm"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateMetadata = void 0;
    const path_1 = require("path");
    const os_1 = __importDefault(require("os"));
    const lodash_1 = require("lodash");
    const fs_exists_1 = require("./fs-exists");
    const fs_mkdir_1 = require("./fs-mkdir");
    const fs_readfile_json_1 = require("./fs-readfile-json");
    const fs_writefile_1 = require("./fs-writefile");
    const exit_with_msg_1 = require("./exit-with-msg");
    const common_1 = __importDefault(require("../common"));
    const bolt_configs_1 = require("../constants/bolt-configs");
    const boltvm_1 = __importDefault(require("@gluestack/boltvm"));
    const validateMetadata = (option) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let _yamlContent = yield common_1.default.getAndValidateBoltYaml();
            const _projectFolderPath = (0, path_1.join)(os_1.default.homedir(), bolt_configs_1.BOLT.PROCESS_FOLDER_NAME);
            const _projectListPath = (0, path_1.join)(_projectFolderPath, bolt_configs_1.BOLT.PROCESS_PROJECT_LIST_FILE_NAME);
            const _projectPath = process.cwd();
            if (!(yield (0, fs_exists_1.exists)(_projectFolderPath))) {
                yield (0, fs_mkdir_1.createFolder)(_projectFolderPath);
            }
            const data = (yield (0, fs_readfile_json_1.readfile)(_projectListPath)) || [];
            const _projectExists = (0, lodash_1.find)(data, { id: _yamlContent.project_id });
            if (!_projectExists) {
                data.push({
                    id: _yamlContent.project_id,
                    name: _yamlContent.project_name,
                });
            }
            else {
                const index = (0, lodash_1.findIndex)(data, { id: _yamlContent.project_id });
                data[index] = {
                    id: _yamlContent.project_id,
                    name: _yamlContent.project_name,
                };
            }
            yield (0, fs_writefile_1.writefile)(_projectListPath, JSON.stringify(data) + os_1.default.EOL);
            const boltVm = new boltvm_1.default(process.cwd());
            yield boltVm.addMetadata();
        }
        catch (error) {
            (0, exit_with_msg_1.exitWithMsg)(`Error while validating metatdata: ${error}`);
        }
    });
    exports.validateMetadata = validateMetadata;
});
