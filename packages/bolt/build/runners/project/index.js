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
        define(["require", "exports", "chalk", "./host"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const host_1 = __importDefault(require("./host"));
    class ProjectRunner {
        constructor(_yamlContent) {
            this._yamlContent = _yamlContent;
        }
        host(option) {
            return __awaiter(this, void 0, void 0, function* () {
                const projectRunnerHost = new host_1.default(this._yamlContent);
                // If action is up, run the project in host
                if (option.action === "up") {
                    yield projectRunnerHost.up();
                    return;
                }
                // If action is down, stop the project in host
                yield projectRunnerHost.down();
            });
        }
        vm(cache, Option) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(chalk_1.default.green("coming soon..."));
                process.exit();
                // const projectRunnerVm = new ProjectRunnerVm(this._yamlContent);
                // // If action is up, run the project in vm
                // if (Option.action === "up") {
                //   await projectRunnerVm.up(cache);
                //   return;
                // }
                // // If action is down, stop the project in vm
                // await projectRunnerVm.down();
                // return;
            });
        }
    }
    exports.default = ProjectRunner;
});
