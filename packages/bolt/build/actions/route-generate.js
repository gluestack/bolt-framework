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
        define(["require", "exports", "../common", "../helpers/generate-routes", "../helpers/validate-metadata", "../helpers/validate-services"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const common_1 = __importDefault(require("../common"));
    const generate_routes_1 = __importDefault(require("../helpers/generate-routes"));
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    class RouteGenerate {
        handle() {
            return __awaiter(this, void 0, void 0, function* () {
                const _yamlContent = yield common_1.default.getAndValidateBoltYaml();
                // Validations for metadata and services
                yield (0, validate_metadata_1.validateMetadata)();
                yield (0, validate_services_1.validateServices)();
                console.log(`>> Creating Ingress ${_yamlContent.project_name}...`);
                yield (0, generate_routes_1.default)(_yamlContent);
                process.exit(0);
            });
        }
    }
    exports.default = RouteGenerate;
});
