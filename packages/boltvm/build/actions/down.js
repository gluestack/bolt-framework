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
        define(["require", "exports", "chalk", "../helpers/fs-exists", "../helpers/exit-with-msg", "../helpers/kill-process", "../helpers/update-store", "../helpers/validate-bolt-file", "../runners/vm", "../helpers/validate-project-status"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const fs_exists_1 = require("../helpers/fs-exists");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const kill_process_1 = require("../helpers/kill-process");
    const update_store_1 = require("../helpers/update-store");
    const validate_bolt_file_1 = require("../helpers/validate-bolt-file");
    const vm_1 = __importDefault(require("../runners/vm"));
    const validate_project_status_1 = require("../helpers/validate-project-status");
    class Down {
        handle(localPath) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Check for file path exists or not
                    if (!(yield (0, fs_exists_1.exists)(localPath))) {
                        (0, exit_with_msg_1.exitWithMsg)(">> Please specify correct path in source");
                        return;
                    }
                    const boltConfig = yield (0, validate_bolt_file_1.validateBoltYaml)(localPath);
                    const { project_id } = boltConfig;
                    const project = yield (0, validate_project_status_1.validateProjectStatus)("down", boltConfig);
                    // Unmounting the project
                    console.log(chalk_1.default.yellow(`>> Unmounting project...`));
                    yield (0, kill_process_1.killProcess)(project.mountProcessId);
                    console.log(chalk_1.default.green(`>> Project unmounted successfully...`));
                    // Killing VM process
                    console.log(chalk_1.default.yellow(`>> Exiting from VM...`));
                    yield vm_1.default.destroy(project.vmProcessId);
                    console.log(chalk_1.default.green(`>> VM exited successfully...`));
                    // Updating metadata
                    const json = Object.assign(Object.assign({}, project), { sshPort: null, status: "down", vmProcessId: null, mountProcessId: null, sshProcessIds: null, projectRunnerId: null, updatedAt: Date.now() });
                    yield (0, update_store_1.updateStore)("projects", project_id, json);
                }
                catch (error) {
                    (0, exit_with_msg_1.exitWithMsg)(`Error while stopping VM: ${error.message}`);
                }
            });
        }
    }
    exports.default = Down;
});
