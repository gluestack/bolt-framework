"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exitWithMsg = void 0;
const chalk_1 = __importDefault(require("chalk"));
const exitWithMsg = (msg, code = -1) => {
    console.log(chalk_1.default.redBright(msg));
    process.exit(code);
};
exports.exitWithMsg = exitWithMsg;
