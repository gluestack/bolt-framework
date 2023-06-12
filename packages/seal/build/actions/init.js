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
        define(["require", "exports", "path", "os", "../helpers/fs-exists", "../helpers/exit-with-msg", "../helpers/fs-readfile-json", "../helpers/fs-writefile", "../helpers/fs-mkdir", "lodash", "chalk", "moment"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = require("path");
    const os = __importStar(require("os"));
    const fs_exists_1 = require("../helpers/fs-exists");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const fs_readfile_json_1 = require("../helpers/fs-readfile-json");
    const fs_writefile_1 = require("../helpers/fs-writefile");
    const fs_mkdir_1 = require("../helpers/fs-mkdir");
    const lodash_1 = require("lodash");
    const chalk_1 = __importDefault(require("chalk"));
    const moment_1 = __importDefault(require("moment"));
    exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // if service doesn't exists, exit
            const _projectPath = process.cwd();
            const _projectName = _projectPath.split("/")[_projectPath.split("/").length - 1];
            const _projectFolderPath = (0, path_1.join)(os.homedir(), ".seal");
            const ID = (0, moment_1.default)().valueOf().toString();
            const _projectListPath = (0, path_1.join)(_projectFolderPath, "projects.json");
            const _yamlPath = (0, path_1.join)("seal.yaml");
            const _envPath = (0, path_1.join)(".env.tpl");
            // check if given service has a seal.yaml file
            const _yamlExists = yield (0, fs_exists_1.exists)(_yamlPath);
            // if yaml doesn't exists, exit
            if (_yamlExists) {
                throw new Error(`> Cannot init "${(0, path_1.relative)(".", _yamlPath)}" file already exists`);
            }
            yield (0, fs_writefile_1.writefile)(_yamlPath, `envfile: .env.tpl
project_id: "${ID}"
project_name: ${_projectName}
default_runner: local
services:
ingress:` + os.EOL);
            yield (0, fs_writefile_1.writefile)(_envPath, "" + os.EOL);
            if (!(yield (0, fs_exists_1.exists)(_projectFolderPath))) {
                yield (0, fs_mkdir_1.createFolder)(_projectFolderPath);
            }
            const data = (yield (0, fs_readfile_json_1.readfile)(_projectListPath)) || [];
            if (!(0, lodash_1.find)(data, { path: _projectPath })) {
                data.push({
                    id: ID,
                    name: _projectName,
                    path: _projectPath,
                });
            }
            yield (0, fs_writefile_1.writefile)(_projectListPath, JSON.stringify(data) + os.EOL);
            console.log(`> Installed seal in ${chalk_1.default.green(_projectPath)}`);
        }
        catch (err) {
            yield (0, exit_with_msg_1.exitWithMsg)(err.message || err);
        }
    });
});
