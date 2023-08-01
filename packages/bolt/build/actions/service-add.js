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
        define(["require", "exports", "@gluestack/helpers", "chalk", "lodash", "path", "../constants/bolt-configs", "../helpers/detect-project", "../helpers/exit-with-msg", "../helpers/fs-copy", "../helpers/fs-exists", "../helpers/parse-yaml", "../helpers/reWriteFile", "../helpers/stringify-yaml", "../helpers/update-store", "../helpers/validate-metadata", "../helpers/validate-services", "../validations/bolt", "../validations/bolt-service"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const helpers_1 = require("@gluestack/helpers");
    const chalk_1 = __importDefault(require("chalk"));
    const lodash_1 = require("lodash");
    const path_1 = require("path");
    const bolt_configs_1 = require("../constants/bolt-configs");
    const detect_project_1 = __importDefault(require("../helpers/detect-project"));
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const fs_copy_1 = require("../helpers/fs-copy");
    const fs_exists_1 = require("../helpers/fs-exists");
    const parse_yaml_1 = require("../helpers/parse-yaml");
    const reWriteFile_1 = __importDefault(require("../helpers/reWriteFile"));
    const stringify_yaml_1 = require("../helpers/stringify-yaml");
    const update_store_1 = require("../helpers/update-store");
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    const bolt_1 = require("../validations/bolt");
    const bolt_service_1 = require("../validations/bolt-service");
    class ServiceAdd {
        handle(serviceName, directoryPath) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                serviceName = (0, helpers_1.removeSpecialChars)(serviceName);
                directoryPath = (0, path_1.relative)(".", directoryPath).replace(/\/+$/, "");
                const _yamlPath = (0, path_1.join)(bolt_configs_1.BOLT.YAML_FILE_NAME);
                if (!(yield (0, fs_exists_1.exists)(_yamlPath))) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${_yamlPath}" doesn't exists`);
                }
                if (directoryPath === "") {
                    directoryPath = ".";
                }
                if (!(yield (0, fs_exists_1.exists)(directoryPath))) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${directoryPath}" directory doesn't exists`);
                }
                const _serviceYamlPath = (0, path_1.join)(directoryPath, bolt_configs_1.BOLT.SERVICE_YAML_FILE_NAME);
                const _runDockerfilePath = (0, path_1.join)(directoryPath, "run.Dockerfile");
                const _buildDockerfilePath = (0, path_1.join)(directoryPath, "build.Dockerfile");
                if (yield (0, fs_exists_1.exists)(_serviceYamlPath)) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${directoryPath}" is already a service`);
                }
                const _yamlContent = yield (0, bolt_1.validateBolt)(yield (0, parse_yaml_1.parseYAML)(_yamlPath));
                if (_yamlContent) {
                    if (!_yamlContent.services || (0, lodash_1.isEmpty)(_yamlContent.services)) {
                        _yamlContent.services = {};
                    }
                    if (_yamlContent.services[serviceName]) {
                        yield (0, exit_with_msg_1.exitWithMsg)(`>> "${serviceName}" service already exists`);
                    }
                    _yamlContent.services[serviceName] = {
                        path: directoryPath,
                    };
                }
                console.log(`Creating app in ${(0, path_1.join)(directoryPath)}`);
                console.log(`Scanning source code`);
                const projectType = (0, detect_project_1.default)(directoryPath);
                if (projectType === "Unknown") {
                    console.log(`Detected an ${chalk_1.default.redBright(projectType)} app`);
                    console.log(chalk_1.default.yellow(`Manually edit "bolt.service.yaml", "run.Dockerfile", "build.Dockerfile"`));
                }
                else {
                    console.log(`Detected ${chalk_1.default.green(projectType)} app`);
                }
                const folderPath = (0, path_1.join)(__dirname, "..", "templates", projectType);
                if (!(yield (0, fs_exists_1.exists)(folderPath))) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`"${chalk_1.default.redBright(projectType)}" service is not supported`);
                }
                yield (0, fs_copy_1.copyFolder)(folderPath, directoryPath);
                let replaceArr = [
                    {
                        source: "SERVICE_NAME",
                        replace: serviceName,
                    },
                    {
                        source: "DIRECTORY_PATH",
                        replace: directoryPath,
                    },
                    {
                        source: "FOLDER_NAME",
                        replace: directoryPath.split("/")[directoryPath.split("/").length - 1],
                    },
                ];
                const content = yield (0, bolt_service_1.validateBoltService)(yield (0, parse_yaml_1.parseYAML)(_serviceYamlPath));
                const service_runners = content === null || content === void 0 ? void 0 : content.service_runners;
                if ((_b = (_a = service_runners === null || service_runners === void 0 ? void 0 : service_runners.docker) === null || _a === void 0 ? void 0 : _a.ports) === null || _b === void 0 ? void 0 : _b.length) {
                    // for (const port of service_runners?.docker?.ports) {
                    // const replacePortBy = port.split(":")[0];
                    // const findPortBy = parseInt(port.split(":")[1]);
                    // let portFound = findPortBy;
                    // try {
                    //   portFound = await DockerodeHelper.getPort(findPortBy, [], 100);
                    // } catch (e) {
                    //   //
                    // }
                    // replaceArr.push({
                    //   source: replacePortBy,
                    //   replace: portFound.toString(),
                    // });
                    // }
                }
                yield (0, reWriteFile_1.default)(_serviceYamlPath, replaceArr);
                yield (0, reWriteFile_1.default)(_runDockerfilePath, replaceArr);
                yield (0, reWriteFile_1.default)(_buildDockerfilePath, replaceArr);
                yield (0, stringify_yaml_1.stringifyYAML)(_yamlContent, _yamlPath);
                const json = {
                    status: "down",
                    serviceRunner: null,
                    projectRunner: null,
                    port: null,
                    processId: null,
                };
                yield (0, update_store_1.updateStore)("services", serviceName, json);
                console.log(`Installed ${chalk_1.default.green(serviceName)} service in ${chalk_1.default.green((0, path_1.join)(directoryPath))}`);
                console.log(chalk_1.default.yellow("Verifying metadata for other services.."));
                // Validate metadata
                yield (0, validate_metadata_1.validateMetadata)();
                yield (0, validate_services_1.validateServices)();
                console.log(chalk_1.default.green("Metadata verified"));
            });
        }
    }
    exports.default = ServiceAdd;
});
