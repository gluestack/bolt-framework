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
        define(["require", "exports", "chalk", "./host", "./vm"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const host_1 = __importDefault(require("./host"));
    const vm_1 = __importDefault(require("./vm"));
    class ProjectRunner {
        constructor(_yamlContent) {
            this._yamlContent = _yamlContent;
        }
        host(option) {
            return __awaiter(this, void 0, void 0, function* () {
                const projectRunnerHost = new host_1.default(this._yamlContent);
                const { action } = option;
                switch (action) {
                    case "up":
                        yield projectRunnerHost.up();
                        break;
                    case "down":
                        yield projectRunnerHost.down();
                        break;
                    default:
                        console.log(chalk_1.default.red(`Invalid action: ${action}`));
                        break;
                }
            });
        }
        vm(option, cache) {
            return __awaiter(this, void 0, void 0, function* () {
                const projectRunnerVm = new vm_1.default(this._yamlContent);
                const { action } = option;
                switch (action) {
                    case "up":
                        yield projectRunnerVm.up(cache || false);
                        break;
                    case "down":
                        yield projectRunnerVm.down();
                        break;
                    case "exec":
                        yield projectRunnerVm.exec();
                        break;
                    default:
                        console.log(chalk_1.default.red(`Invalid action: ${action}`));
                        break;
                }
            });
        }
    }
    exports.default = ProjectRunner;
});
