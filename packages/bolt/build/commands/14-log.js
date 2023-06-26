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
        define(["require", "exports", "../actions/log"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const log_1 = __importDefault(require("../actions/log"));
    exports.default = (program) => __awaiter(void 0, void 0, void 0, function* () {
        program
            .command("log")
            .argument("<service-name>", "name of the service")
            .option("-f, --follow", "follow logs")
            .option("--vm", "show logs of vm")
            .description(`Gives you the log of a service`)
            .action((serviceName, option) => __awaiter(void 0, void 0, void 0, function* () {
            const log = new log_1.default();
            yield log.handle(serviceName, option);
        }));
    });
});
