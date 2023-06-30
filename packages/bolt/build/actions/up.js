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
        define(["require", "exports", "fs-extra", "path", "../constants/platforms", "../helpers/exit-with-msg", "../helpers/generate-routes", "../helpers/validate-metadata", "../helpers/validate-services", "../common", "../runners/service/docker", "../runners/project", "../constants/bolt-configs", "../helpers/stringify-yaml"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_extra_1 = require("fs-extra");
    const path_1 = require("path");
    const platforms_1 = require("../constants/platforms");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const generate_routes_1 = __importDefault(require("../helpers/generate-routes"));
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    const common_1 = __importDefault(require("../common"));
    const docker_1 = __importDefault(require("../runners/service/docker"));
    const project_1 = __importDefault(require("../runners/project"));
    const bolt_configs_1 = require("../constants/bolt-configs");
    const stringify_yaml_1 = require("../helpers/stringify-yaml");
    class Up {
        handle(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let projectRunnerOption;
                if (options.host || options.vm) {
                    projectRunnerOption = options.host ? "host" : "vm";
                }
                const _yamlContent = yield common_1.default.getAndValidateBoltYaml();
                if (!projectRunnerOption) {
                    projectRunnerOption = _yamlContent.default_project_runner;
                }
                else {
                    _yamlContent.default_project_runner = projectRunnerOption;
                    yield (0, stringify_yaml_1.stringifyYAML)(_yamlContent, (0, path_1.join)(process.cwd(), bolt_configs_1.BOLT.YAML_FILE_NAME));
                }
                const defaultServiceRunner = _yamlContent.default_service_runner;
                if (!defaultServiceRunner) {
                    (0, exit_with_msg_1.exitWithMsg)("Please Specify a default runner for the app.");
                }
                if (!platforms_1.serviceRunners.includes(defaultServiceRunner)) {
                    (0, exit_with_msg_1.exitWithMsg)(`Invalid runner "${_yamlContent.default_service_runner}" specified in bolt.yaml`);
                }
                // Validations for metadata and services
                yield (0, validate_metadata_1.validateMetadata)();
                yield (0, validate_services_1.validateServices)();
                // 1. generates routes
                console.log(`>> Creating Ingress...`);
                const ports = yield (0, generate_routes_1.default)(_yamlContent);
                // 2. generates .env
                yield common_1.default.generateEnv();
                // 3. creating a project runner instance
                const projectRunner = new project_1.default(_yamlContent);
                // 4. starts the services on specified project runner
                switch (projectRunnerOption) {
                    case "host":
                        yield projectRunner.host({ action: "up" });
                        break;
                    case "vm":
                        const cache = options.cache ? true : false;
                        yield projectRunner.vm({ action: "up" }, cache);
                        break;
                    default:
                        (0, exit_with_msg_1.exitWithMsg)(`Invalid runner "${projectRunnerOption}" specified in ${bolt_configs_1.BOLT.YAML_FILE_NAME}`);
                        break;
                }
                // 5. starts nginx if the project runner is not vm and nginx config exists in bolt.yaml
                if (projectRunnerOption !== "vm" && _yamlContent.ingress) {
                    const nginxConfig = (0, path_1.join)(process.cwd(), bolt_configs_1.BOLT.NGINX_CONFIG_FILE_NAME);
                    if (yield (0, fs_extra_1.exists)(nginxConfig)) {
                        yield docker_1.default.startOnly(bolt_configs_1.BOLT.NGINX_CONTAINER_NAME, ports, `${nginxConfig}:/etc/nginx/nginx.conf`, "nginx:latest");
                    }
                }
            });
        }
    }
    exports.default = Up;
});
