var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
        define(["require", "exports", "os", "chalk", "moment", "@gluestack/boltvm", "lodash", "path", "../helpers/fs-exists", "../helpers/exit-with-msg", "../helpers/fs-readfile-json", "../helpers/fs-writefile", "../helpers/fs-mkdir", "../helpers/stringify-yaml", "../constants/bolt-file", "../constants/bolt-configs", "@gluestack/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const os = __importStar(require("os"));
    const chalk_1 = __importDefault(require("chalk"));
    const moment_1 = __importDefault(require("moment"));
    const boltvm_1 = __importDefault(require("@gluestack/boltvm"));
    const lodash_1 = require("lodash");
    const path_1 = require("path");
    const fs_exists_1 = require("../helpers/fs-exists");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const fs_readfile_json_1 = require("../helpers/fs-readfile-json");
    const fs_writefile_1 = require("../helpers/fs-writefile");
    const fs_mkdir_1 = require("../helpers/fs-mkdir");
    const stringify_yaml_1 = require("../helpers/stringify-yaml");
    const bolt_file_1 = require("../constants/bolt-file");
    const bolt_configs_1 = require("../constants/bolt-configs");
    const helpers_1 = require("@gluestack/helpers");
    class Init {
        handle(options) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // if service doesn't exists, exit
                    const _projectPath = process.cwd();
                    const _projectName = options.name ? options.name : (0, path_1.basename)(_projectPath);
                    const _projectFolderPath = (0, path_1.join)(os.homedir(), bolt_configs_1.BOLT.PROCESS_FOLDER_NAME);
                    const ID = (0, moment_1.default)().valueOf().toString();
                    const _projectListPath = (0, path_1.join)(_projectFolderPath, bolt_configs_1.BOLT.PROCESS_PROJECT_LIST_FILE_NAME);
                    const _yamlPath = (0, path_1.join)(bolt_configs_1.BOLT.YAML_FILE_NAME);
                    const _envPath = (0, path_1.join)(".env.tpl");
                    // check if given service has a bolt.yaml file
                    const _yamlExists = yield (0, fs_exists_1.exists)(_yamlPath);
                    // if yaml doesn't exists, exit
                    if (_yamlExists) {
                        throw new Error(`>> Cannot init "${(0, path_1.relative)(".", _yamlPath)}" file already exists`);
                    }
                    const json = Object.assign(Object.assign({}, bolt_file_1.boltFile), { project_id: `${ID}`, project_name: `${_projectName}` });
                    if (json.vm) {
                        json.vm.name = (0, helpers_1.removeSpecialChars)((0, path_1.basename)(_projectPath));
                    }
                    yield (0, stringify_yaml_1.stringifyYAML)(json, _yamlPath);
                    yield (0, fs_writefile_1.writefile)(_envPath, "" + os.EOL);
                    if (!(yield (0, fs_exists_1.exists)(_projectFolderPath))) {
                        yield (0, fs_mkdir_1.createFolder)(_projectFolderPath);
                    }
                    const data = (yield (0, fs_readfile_json_1.readfile)(_projectListPath)) || [];
                    const _projectExists = (0, lodash_1.find)(data, { id: ID });
                    if (!_projectExists) {
                        data.push({
                            id: ID,
                            name: _projectName,
                        });
                    }
                    else {
                        const index = (0, lodash_1.findIndex)(data, { id: ID });
                        data[index] = {
                            id: ID,
                            name: _projectName,
                        };
                    }
                    yield (0, fs_writefile_1.writefile)(_projectListPath, JSON.stringify(data) + os.EOL);
                    // if vm is present in json, add metadata
                    if (json.vm) {
                        const boltVM = new boltvm_1.default(_projectPath);
                        yield boltVM.addMetadata();
                    }
                    console.log(`>> Installed bolt in ${chalk_1.default.green(_projectPath)}`);
                }
                catch (err) {
                    yield (0, exit_with_msg_1.exitWithMsg)(err.message || err);
                }
            });
        }
    }
    exports.default = Init;
});
