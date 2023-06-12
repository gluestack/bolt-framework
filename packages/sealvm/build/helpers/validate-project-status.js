var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./exit-with-msg", "./get-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateProjectStatus = void 0;
    const exit_with_msg_1 = require("./exit-with-msg");
    const get_store_1 = require("./get-store");
    const validateProjectStatus = (projectName, command) => __awaiter(void 0, void 0, void 0, function* () {
        const store = yield (0, get_store_1.getStore)();
        const data = store.get("projects");
        const project = data && data[projectName] ? data[projectName] : null;
        switch (command) {
            case "create":
                if (project && (project.status === "build" || project.status === "up")) {
                    (0, exit_with_msg_1.exitWithMsg)(`>> "${projectName}"'s image has already been built and sealvm is running.`);
                }
                break;
            case "run":
                if (project && project.status === "down") {
                    (0, exit_with_msg_1.exitWithMsg)(`>> sealvm is down, please create the project first!!!`);
                }
                if (project && project.status === "up") {
                    (0, exit_with_msg_1.exitWithMsg)(`>> "${projectName}" is already running`);
                }
                break;
            case "down":
                if (project && project.status === "down") {
                    (0, exit_with_msg_1.exitWithMsg)(`> "${projectName}" project is already down or is not running`);
                }
                break;
            case "status":
                if (!project) {
                    (0, exit_with_msg_1.exitWithMsg)(">> Project has not been created yet.");
                }
                break;
            case "exec":
                if (!project) {
                    (0, exit_with_msg_1.exitWithMsg)(`>> No container exist with name: "${projectName}"`);
                }
                if (project && project.status === "down") {
                    (0, exit_with_msg_1.exitWithMsg)(`>> "${projectName}" is down, please run the project first!!!`);
                }
                break;
            case "log":
                if (project && project.status === "down") {
                    (0, exit_with_msg_1.exitWithMsg)(`> "${projectName}" project is already down or is not running`);
                }
                break;
            default:
                break;
        }
        return project;
    });
    exports.validateProjectStatus = validateProjectStatus;
});
