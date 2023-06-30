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
        define(["require", "exports", "chalk", "path", "../helpers/exit-with-msg", "../helpers/validate-bolt-file", "../helpers/validate-project-status"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const path_1 = require("path");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const validate_bolt_file_1 = require("../helpers/validate-bolt-file");
    const validate_project_status_1 = require("../helpers/validate-project-status");
    class Status {
        handle(localPath) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    localPath =
                        localPath === "." ? process.cwd() : (0, path_1.join)(process.cwd(), localPath);
                    // Check for valid boltvm yml file
                    const boltConfig = yield (0, validate_bolt_file_1.validateBoltYaml)(localPath);
                    const { project_name } = boltConfig;
                    // Check if project has been created
                    const project = yield (0, validate_project_status_1.validateProjectStatus)("status", boltConfig);
                    const status = project.status;
                    switch (status) {
                        case "build":
                            console.log(chalk_1.default.green(`>> ${project_name}'s image has been build on boltvm. `));
                            break;
                        case "up":
                            console.log(chalk_1.default.green(`>> ${project_name} is up & running on boltvm. `));
                            break;
                        case "down":
                            console.log(chalk_1.default.green(`>> ${project_name} is down. `));
                            break;
                        default:
                            console.log(chalk_1.default.green(`>> ${project_name} has unknown status. ${status} `));
                            break;
                    }
                }
                catch (error) {
                    (0, exit_with_msg_1.exitWithMsg)("Error while getting status of container: ${error.message}");
                }
            });
        }
    }
    exports.default = Status;
});
