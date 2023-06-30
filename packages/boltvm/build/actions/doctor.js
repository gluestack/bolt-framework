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
        define(["require", "exports", "child_process", "../helpers/exit-with-msg", "util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const child_process_1 = require("child_process");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const util_1 = __importDefault(require("util"));
    class Doctor {
        run(command, args) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const execPromise = util_1.default.promisify(child_process_1.exec);
                    const { stderr } = yield execPromise(`${command} ${args.join(" ")}`);
                    if (stderr) {
                        yield (0, exit_with_msg_1.exitWithMsg)(`${command} is not installed. Please install it and try again.`);
                    }
                }
                catch (error) {
                    if (error.stderr) {
                        yield (0, exit_with_msg_1.exitWithMsg)(`${command} is not installed. Please install it and try again.`);
                    }
                }
            });
        }
        handle() {
            return __awaiter(this, void 0, void 0, function* () {
                // Check if qemu-system-aarch64 is installed
                yield this.run("qemu-system-aarch64", ["--version"]);
                // Check if fswatch is installed
                yield this.run("fswatch", ["--version"]);
                // Check if rsync is installed
                yield this.run("rsync", ["--version"]);
            });
        }
    }
    exports.default = Doctor;
});
