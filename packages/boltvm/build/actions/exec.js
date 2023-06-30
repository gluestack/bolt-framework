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
        define(["require", "exports", "chalk", "../constants/bolt-vm", "../helpers/execute", "../helpers/exit-with-msg", "../helpers/validate-project-status", "../helpers/validate-bolt-file", "../helpers/fs-exists"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const bolt_vm_1 = require("../constants/bolt-vm");
    const execute_1 = require("../helpers/execute");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const validate_project_status_1 = require("../helpers/validate-project-status");
    const validate_bolt_file_1 = require("../helpers/validate-bolt-file");
    const fs_exists_1 = require("../helpers/fs-exists");
    class Exec {
        handle(localPath) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Check for file path exists or not
                    if (!(yield (0, fs_exists_1.exists)(localPath))) {
                        (0, exit_with_msg_1.exitWithMsg)(">> Please specify correct path in source!");
                        return;
                    }
                    const boltConfig = yield (0, validate_bolt_file_1.validateBoltYaml)(localPath);
                    const project = yield (0, validate_project_status_1.validateProjectStatus)("exec", boltConfig);
                    const sshPort = project === null || project === void 0 ? void 0 : project.sshPort;
                    if (!sshPort) {
                        (0, exit_with_msg_1.exitWithMsg)(">> Unable to find ssh port for the container!");
                    }
                    if (project && sshPort) {
                        console.log(chalk_1.default.yellow(`>> Opening shell...`));
                        const args = ["-p", sshPort.toString(), ...bolt_vm_1.SSH_CONFIG];
                        yield (0, execute_1.execute)("ssh", args, {
                            stdio: "inherit",
                            shell: true,
                        });
                    }
                }
                catch (error) {
                    (0, exit_with_msg_1.exitWithMsg)(`>> Unable to open shell!, ${error.message}`);
                }
            });
        }
    }
    exports.default = Exec;
});
