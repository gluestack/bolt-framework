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
        define(["require", "exports", "../actions/init", "../constants/bolt-configs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const init_1 = __importDefault(require("../actions/init"));
    const bolt_configs_1 = require("../constants/bolt-configs");
    exports.default = (program) => __awaiter(void 0, void 0, void 0, function* () {
        program
            .command("init")
            .option("-n, --name <name>", "Project name")
            .description(`Inits the project with ${bolt_configs_1.BOLT.YAML_FILE_NAME} file`)
            .action((options) => __awaiter(void 0, void 0, void 0, function* () {
            const init = new init_1.default();
            yield init.handle(options);
        }));
    });
});
