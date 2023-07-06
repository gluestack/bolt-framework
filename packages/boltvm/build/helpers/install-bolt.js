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
        define(["require", "exports", "ssh2", "../actions/down", "../constants/bolt-vm", "./exit-with-msg"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runCommandInVM = void 0;
    const ssh2_1 = require("ssh2");
    const down_1 = __importDefault(require("../actions/down"));
    const bolt_vm_1 = require("../constants/bolt-vm");
    const exit_with_msg_1 = require("./exit-with-msg");
    const runCommandInVM = (command, args, portNumber, count = 0) => __awaiter(void 0, void 0, void 0, function* () {
        const interval = 5000;
        const maxDuration = 2 * 60 * 1000;
        const maxIterations = Math.floor(maxDuration / interval);
        let currentCounter = 0;
        return new Promise((resolve, _reject) => {
            try {
                const pollConnection = setInterval(() => {
                    currentCounter++;
                    const conn = new ssh2_1.Client();
                    conn.connect(Object.assign(Object.assign({}, bolt_vm_1.VM_CONFIG), { port: portNumber }));
                    conn.on("ready", () => {
                        clearInterval(pollConnection);
                        conn.exec(`${command} ${args.join(" ")}`, {}, (err, stream) => {
                            if (err)
                                throw err;
                            stream
                                .on("close", (code, signal) => {
                                // console.log(">> Successfully installed @gluestack/bolt@latest");
                                conn.end();
                                return resolve(conn);
                            })
                                .on("data", (data) => {
                                // console.log(">> stdout:", data.toString());
                            })
                                .stderr.on("data", (data) => {
                                // console.log(">> stderr:", data.toString());
                            });
                        });
                    });
                    conn.on("error", (err) => { });
                    if (currentCounter >= maxIterations) {
                        clearInterval(pollConnection);
                        (0, exit_with_msg_1.exitWithMsg)(">> Maximum retries exceeded! Could not prepare VM.");
                        const downVm = new down_1.default();
                        downVm.handle(process.cwd());
                    }
                }, interval);
            }
            catch (error) {
                (0, exit_with_msg_1.exitWithMsg)(">> Error establishing connection", error);
            }
        });
    });
    exports.runCommandInVM = runCommandInVM;
});
