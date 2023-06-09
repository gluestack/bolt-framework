"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.killProcess = void 0;
const chalk_1 = __importDefault(require("chalk"));
const tree_kill_1 = __importDefault(require("tree-kill"));
const killProcess = (processId) => {
    return new Promise((resolve, reject) => {
        (0, tree_kill_1.default)(processId, "SIGTERM", (err) => {
            if (err) {
                console.log(chalk_1.default.red(">> Error killing process:", err.message));
                return reject(err);
            }
            else {
                console.log(chalk_1.default.green(">> Exited from the process successfully."));
                return resolve(true);
            }
        });
    });
};
exports.killProcess = killProcess;
