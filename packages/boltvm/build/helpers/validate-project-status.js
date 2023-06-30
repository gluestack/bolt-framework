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
        define(["require", "exports", "../common", "./exit-with-msg", "./get-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateProjectStatus = void 0;
    const common_1 = __importDefault(require("../common"));
    const exit_with_msg_1 = require("./exit-with-msg");
    const get_store_1 = require("./get-store");
    const validateProjectStatus = (action, boltConfig) => __awaiter(void 0, void 0, void 0, function* () {
        const projectId = boltConfig.project_id;
        const projectName = boltConfig.project_name;
        const store = yield (0, get_store_1.getStore)();
        const data = store.get("projects");
        let project = data[projectId];
        if (!project && boltConfig) {
            project = yield common_1.default.createProjectMetadata(boltConfig);
        }
        switch (action) {
            case "create":
                if (project && (project.status === "build" || project.status === "up")) {
                    (0, exit_with_msg_1.exitWithMsg)(`>> "${projectName}"'s image has already been built and boltvm is running.`);
                }
                break;
            case "run":
                if (project && project.status === "down") {
                    (0, exit_with_msg_1.exitWithMsg)(`>> boltvm is down, please create the project first!!!`);
                }
                if (project && project.status === "up") {
                    (0, exit_with_msg_1.exitWithMsg)(`>> "${projectName}" is already running`);
                }
                break;
            case "down":
                if (project && project.status === "down") {
                    (0, exit_with_msg_1.exitWithMsg)(`>> "${projectName}" project is already down or is not running`);
                }
                break;
            case "status":
                if (!project) {
                    (0, exit_with_msg_1.exitWithMsg)(">> Project has not been created yet.");
                }
                break;
            case "exec":
                if (!project) {
                    (0, exit_with_msg_1.exitWithMsg)(`>> No container exist for project id: "${projectName}"`);
                }
                if (project && project.status === "down") {
                    (0, exit_with_msg_1.exitWithMsg)(`>> "${projectName}" is down, please run the project first!!!`);
                }
                break;
            case "log":
                if (project && project.status === "down") {
                    (0, exit_with_msg_1.exitWithMsg)(`>> "${projectName}" project is already down or is not running`);
                }
                break;
            default:
                break;
        }
        return project;
    });
    exports.validateProjectStatus = validateProjectStatus;
});
