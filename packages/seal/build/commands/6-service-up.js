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
        define(["require", "exports", "commander", "../actions/service-up"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const commander_1 = require("commander");
    const service_up_1 = __importDefault(require("../actions/service-up"));
    exports.default = (program) => __awaiter(void 0, void 0, void 0, function* () {
        const platformOption = new commander_1.Option("-p, --platform <platform>", "platform name to run the service on").choices(["docker", "local"]);
        program
            .command("service:up")
            .argument("<service-name>", 'service containing "seal.service.yaml" file and present in "seal.yaml" services')
            .addOption(platformOption.makeOptionMandatory())
            .description(`Starts a service from "seal.yaml" services`)
            .action(service_up_1.default);
    });
});
