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
        define(["require", "exports", "./fs-exists", "child_process", "path", "./fs-mkdir", "fs", "./fs-writefile"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.executeDetached = void 0;
    const fs_exists_1 = require("./fs-exists");
    const child_process_1 = require("child_process");
    const path_1 = require("path");
    const fs_mkdir_1 = require("./fs-mkdir");
    const fs = __importStar(require("fs"));
    const fs_writefile_1 = require("./fs-writefile");
    const executeDetached = (command, args, servicePath, options, serviceName) => __awaiter(void 0, void 0, void 0, function* () {
        let serviceLogPath = (0, path_1.join)(".logs", (0, path_1.basename)(servicePath));
        if (serviceName) {
            serviceLogPath = (0, path_1.join)(".logs", serviceName);
        }
        if (!(yield (0, fs_exists_1.exists)(serviceLogPath))) {
            yield (0, fs_mkdir_1.createFolder)(serviceLogPath);
        }
        const outputLogPath = (0, path_1.join)(serviceLogPath, "out.log");
        const errorLogPath = (0, path_1.join)(serviceLogPath, "err.log");
        yield (0, fs_writefile_1.writefile)(outputLogPath, "");
        yield (0, fs_writefile_1.writefile)(errorLogPath, "");
        // Open a file to redirect standard output/error streams
        const stdOut = fs.openSync(outputLogPath, "a");
        const stdErr = fs.openSync(errorLogPath, "a");
        // Spawn the process in detached mode
        const child = (0, child_process_1.spawn)(command, args, Object.assign(Object.assign({}, options), { detached: true, stdio: ["ignore", stdOut, stdErr] }));
        // Detach the child process
        child.unref();
        fs.closeSync(stdOut);
        fs.closeSync(stdErr);
        // Optionally, listen for events
        child.on("error", (err) => {
            console.log(">> (detached) Error:", err.message);
            process.exit();
        });
        child.on("exit", (code, signal) => {
            console.log(">> (detached) Process exited with code:", code);
        });
        return child.pid;
    });
    exports.executeDetached = executeDetached;
});
