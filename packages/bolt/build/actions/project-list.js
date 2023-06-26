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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "os", "../helpers/fs-exists", "../helpers/exit-with-msg", "../helpers/fs-readfile-json", "@gluestack/helpers", "../constants/bolt-configs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = require("path");
    const os = __importStar(require("os"));
    const fs_exists_1 = require("../helpers/fs-exists");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const fs_readfile_json_1 = require("../helpers/fs-readfile-json");
    const helpers_1 = require("@gluestack/helpers");
    const bolt_configs_1 = require("../constants/bolt-configs");
    class ProjectList {
        handle() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const _projectListPath = (0, path_1.join)(os.homedir(), bolt_configs_1.BOLT.PROCESS_FOLDER_NAME, bolt_configs_1.BOLT.PROCESS_PROJECT_LIST_FILE_NAME);
                    const _projectListExists = yield (0, fs_exists_1.exists)(_projectListPath);
                    if (!_projectListExists) {
                        throw new Error(`> There are no available Bolt projects`);
                    }
                    const data = (yield (0, fs_readfile_json_1.readfile)(_projectListPath)) || [];
                    if (!data || !data.length) {
                        throw new Error(`> There are no available Bolt projects`);
                    }
                    const head = ["#", "Project Id", "Project Name"];
                    const rows = [];
                    let counter = 0;
                    data.forEach((item) => {
                        counter++;
                        rows.push([counter, item.id, item.name]);
                    });
                    helpers_1.ConsoleTable.print(head, rows);
                }
                catch (err) {
                    yield (0, exit_with_msg_1.exitWithMsg)(err.message || err);
                }
            });
        }
    }
    exports.default = ProjectList;
});
