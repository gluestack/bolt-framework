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
        define(["require", "exports", "chalk", "path", "./execute", "./fs-exists"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getLogs = void 0;
    const chalk_1 = __importDefault(require("chalk"));
    const path_1 = require("path");
    const execute_1 = require("./execute");
    const fs_exists_1 = require("./fs-exists");
    const getLogs = (serviceName, servicePath, isFollow, filePath) => __awaiter(void 0, void 0, void 0, function* () {
        //check if log file exists in the service or not
        const serviceLogPath = filePath;
        if (!(yield (0, fs_exists_1.exists)(serviceLogPath))) {
            console.log(chalk_1.default.red(`>> No .logs folder found in the service: ${serviceName}`));
            return;
        }
        const outputLogPath = (0, path_1.join)(serviceLogPath, "out.log");
        const errorLogPath = (0, path_1.join)(serviceLogPath, "err.log");
        if (!(yield (0, fs_exists_1.exists)(outputLogPath))) {
            console.log(chalk_1.default.red(`>> out.logs file not found for ${serviceName}`));
            return;
        }
        if (!(yield (0, fs_exists_1.exists)(errorLogPath))) {
            console.log(chalk_1.default.red(`>> err.logs file not found for ${serviceName}`));
            return;
        }
        const catLogsCommand = `cat  ${(0, path_1.join)(serviceLogPath, "*.log")}`;
        const tailLogsCommand = `tail -f ${(0, path_1.join)(serviceLogPath, "*.log")}`;
        const executableCommand = isFollow ? tailLogsCommand : catLogsCommand;
        console.log(chalk_1.default.gray(`$ ${executableCommand}`));
        const args = ["-c", `'${executableCommand}'`];
        yield (0, execute_1.execute)("sh", args, {
            stdio: "inherit",
            shell: true,
        });
    });
    exports.getLogs = getLogs;
});
