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
        define(["require", "exports", "commander", "../actions/service-up", "../constants/bolt-configs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const commander_1 = require("commander");
    const service_up_1 = __importDefault(require("../actions/service-up"));
    const bolt_configs_1 = require("../constants/bolt-configs");
    exports.default = (program) => __awaiter(void 0, void 0, void 0, function* () {
        const platformOption = new commander_1.Option("-sr, --service-runner <service-runner>", "service runner to run the service on").choices(["docker", "local"]);
        program
            .command("service:up")
            .argument("<service-name>", `service containing "${bolt_configs_1.BOLT.SERVICE_YAML_FILE_NAME}" file and present in "${bolt_configs_1.BOLT.YAML_FILE_NAME}" services`)
            .addOption(platformOption.makeOptionMandatory())
            .description(`Starts a service from ${bolt_configs_1.BOLT.YAML_FILE_NAME} services`)
            .action((serviceName, options) => __awaiter(void 0, void 0, void 0, function* () {
            const serviceUp = new service_up_1.default();
            serviceUp.handle(serviceName, options);
        }));
    });
});
