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
        define(["require", "exports", "chalk", "path", "../helpers/exit-with-msg", "../helpers/fs-exists", "../helpers/get-store", "../helpers/validate-metadata", "../helpers/validate-services", "../common", "../runners/docker", "../runners/project", "../constants/bolt-configs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const path_1 = require("path");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const fs_exists_1 = require("../helpers/fs-exists");
    const get_store_1 = __importDefault(require("../helpers/get-store"));
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    const common_1 = __importDefault(require("../common"));
    const docker_1 = __importDefault(require("../runners/docker"));
    const project_1 = __importDefault(require("../runners/project"));
    const bolt_configs_1 = require("../constants/bolt-configs");
    class Down {
        handle() {
            return __awaiter(this, void 0, void 0, function* () {
                const _yamlContent = yield common_1.default.getAndValidateBoltYaml();
                // Validations for metadata and services
                yield (0, validate_metadata_1.validateMetadata)();
                yield (0, validate_services_1.validateServices)();
                console.log(`>> Stopping ${_yamlContent.project_name}...`);
                const store = yield (0, get_store_1.default)();
                const projectRunnerEnv = yield store.get("project_runner");
                if (!projectRunnerEnv) {
                    (0, exit_with_msg_1.exitWithMsg)(`>> Project runner not found. Please run the project first.`);
                }
                // 1. creating a project runner instance
                const projectRunner = new project_1.default(_yamlContent);
                // 2. stops the services on particular project runner platform
                switch (projectRunnerEnv) {
                    case "none":
                        (0, exit_with_msg_1.exitWithMsg)(`>> ${_yamlContent.project_name} is not running. Please run "bolt up" first.`);
                        break;
                    case "host":
                        yield projectRunner.host({ action: "down" });
                        break;
                    case "vm":
                        yield projectRunner.vm(false, { action: "down" });
                        break;
                    default:
                        (0, exit_with_msg_1.exitWithMsg)(`>> Unknown server environment for ${_yamlContent.project_name}`);
                        break;
                }
                // 3. stops the nginx container if it is running
                if (projectRunnerEnv !== "vm") {
                    if (yield (0, fs_exists_1.exists)((0, path_1.join)(process.cwd(), bolt_configs_1.BOLT.NGINX_CONFIG_FILE_NAME))) {
                        yield docker_1.default.stopOnly(bolt_configs_1.BOLT.NGINX_CONTAINER_NAME);
                    }
                }
                console.log(chalk_1.default.green(`>> ${_yamlContent.project_name} is down.\n`));
            });
        }
    }
    exports.default = Down;
});
