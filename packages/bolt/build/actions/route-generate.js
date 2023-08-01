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
        define(["require", "exports", "chalk", "../common", "../helpers/execute", "../helpers/generate-routes", "../helpers/validate-metadata", "../helpers/validate-services"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const common_1 = __importDefault(require("../common"));
    const execute_1 = require("../helpers/execute");
    const generate_routes_1 = __importDefault(require("../helpers/generate-routes"));
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    class RouteGenerate {
        handle(options) {
            return __awaiter(this, void 0, void 0, function* () {
                const _yamlContent = yield common_1.default.getAndValidateBoltYaml();
                const isProd = options.prod || false;
                if (isProd) {
                    console.log(chalk_1.default.gray(">> Building Production Envs..."));
                    const args = ["env:generate", "--build", "prod"];
                    yield (0, execute_1.execute)("bolt", args, {});
                }
                // Validations for metadata and services
                yield (0, validate_metadata_1.validateMetadata)();
                yield (0, validate_services_1.validateServices)();
                console.log(`>> Creating Ingress...`);
                yield (0, generate_routes_1.default)(_yamlContent, isProd);
                process.exit(0);
            });
        }
    }
    exports.default = RouteGenerate;
});
