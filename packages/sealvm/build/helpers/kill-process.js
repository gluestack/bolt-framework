"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.killMultipleProcesses = exports.killProcess = void 0;
const tree_kill_1 = __importDefault(require("tree-kill"));
const exit_with_msg_1 = require("./exit-with-msg");
const killProcess = (processId) => {
    (0, tree_kill_1.default)(processId, "SIGTERM", (err) => {
        if (err) {
            (0, exit_with_msg_1.exitWithMsg)(">> Error killing process:" + err.message);
        }
    });
    return Promise.resolve(true);
};
exports.killProcess = killProcess;
const killMultipleProcesses = (processIds) => __awaiter(void 0, void 0, void 0, function* () {
    const killProcessPromises = [];
    for (const pid of processIds) {
        if (pid)
            killProcessPromises.push((0, exports.killProcess)(pid));
    }
    return yield Promise.all(killProcessPromises);
});
exports.killMultipleProcesses = killMultipleProcesses;
