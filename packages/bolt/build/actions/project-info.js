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
        define(["require", "exports", "chalk", "../common", "../actions/service-list", "./route-list"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const common_1 = __importDefault(require("../common"));
    const service_list_1 = __importDefault(require("../actions/service-list"));
    const route_list_1 = __importDefault(require("./route-list"));
    class ProjectInfo {
        handle() {
            return __awaiter(this, void 0, void 0, function* () {
                const _yamlContent = yield common_1.default.getAndValidateBoltYaml();
                console.log(chalk_1.default.blueBright("Project Info\n"));
                console.log("Project Name: ", chalk_1.default.yellow(_yamlContent.project_name));
                console.log("Project ID: ", chalk_1.default.yellow(_yamlContent.project_id));
                console.log(chalk_1.default.blueBright("\nServices List\n"));
                const projectServiceList = new service_list_1.default();
                yield projectServiceList.handle();
                console.log(chalk_1.default.blueBright("\nRoute List\n"));
                const projectRouteList = new route_list_1.default();
                yield projectRouteList.handle();
            });
        }
    }
    exports.default = ProjectInfo;
});
