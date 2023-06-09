"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_exists_1 = require("../helpers/fs-exists");
const parse_yaml_1 = require("../helpers/parse-yaml");
const exit_with_msg_1 = require("../helpers/exit-with-msg");
const detect_project_1 = __importDefault(require("../helpers/detect-project"));
const chalk_1 = __importDefault(require("chalk"));
const fs_copy_1 = require("../helpers/fs-copy");
const stringify_yaml_1 = require("../helpers/stringify-yaml");
const reWriteFile_1 = __importDefault(require("../helpers/reWriteFile"));
const helpers_1 = require("@gluestack/helpers");
const lodash_1 = require("lodash");
const seal_1 = require("../validations/seal");
const seal_service_1 = require("../validations/seal-service");
const get_store_1 = __importDefault(require("../helpers/get-store"));
exports.default = (serviceName, directoryPath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    serviceName = (0, helpers_1.removeSpecialChars)(serviceName);
    directoryPath = (0, path_1.relative)(".", directoryPath).replace(/\/+$/, "");
    const _yamlPath = (0, path_1.join)("seal.yaml");
    if (!(yield (0, fs_exists_1.exists)(_yamlPath))) {
        yield (0, exit_with_msg_1.exitWithMsg)(`> "${_yamlPath}" doesn't exists`);
    }
    if (directoryPath === "") {
        directoryPath = ".";
    }
    if (!(yield (0, fs_exists_1.exists)(directoryPath))) {
        yield (0, exit_with_msg_1.exitWithMsg)(`> "${directoryPath}" directory doesn't exists`);
    }
    const _serviceYamlPath = (0, path_1.join)(directoryPath, "seal.service.yaml");
    const _runDockerfilePath = (0, path_1.join)(directoryPath, "run.Dockerfile");
    const _buildDockerfilePath = (0, path_1.join)(directoryPath, "build.Dockerfile");
    if (yield (0, fs_exists_1.exists)(_serviceYamlPath)) {
        yield (0, exit_with_msg_1.exitWithMsg)(`> "${directoryPath}" is already a service`);
    }
    const _yamlContent = yield (0, seal_1.validateSeal)(yield (0, parse_yaml_1.parseYAML)(_yamlPath));
    if (_yamlContent) {
        if (!_yamlContent.services || (0, lodash_1.isEmpty)(_yamlContent.services)) {
            _yamlContent.services = {};
        }
        if (_yamlContent.services[serviceName]) {
            yield (0, exit_with_msg_1.exitWithMsg)(`> "${serviceName}" service already exists`);
        }
        _yamlContent.services[serviceName] = {
            path: directoryPath,
        };
    }
    console.log(`Creating app in ${(0, path_1.join)(directoryPath)}`);
    console.log(`Scanning source code`);
    const projectType = yield (0, detect_project_1.default)(directoryPath);
    if (projectType === "Unknown") {
        console.log(`Detected an ${chalk_1.default.redBright(projectType)} app`);
        console.log(chalk_1.default.yellow(`Manually edit "seal.service.yaml", "run.Dockerfile", "build.Dockerfile"`));
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
    const content = yield (0, seal_service_1.validateSealService)(yield (0, parse_yaml_1.parseYAML)(_serviceYamlPath));
    if ((_c = (_b = (_a = content === null || content === void 0 ? void 0 : content.platforms) === null || _a === void 0 ? void 0 : _a.docker) === null || _b === void 0 ? void 0 : _b.ports) === null || _c === void 0 ? void 0 : _c.length) {
        for (const port of (_e = (_d = content === null || content === void 0 ? void 0 : content.platforms) === null || _d === void 0 ? void 0 : _d.docker) === null || _e === void 0 ? void 0 : _e.ports) {
            const replacePortBy = port.split(":")[0];
            const findPortBy = parseInt(port.split(":")[1]);
            let portFound = findPortBy;
            try {
                portFound = yield helpers_1.DockerodeHelper.getPort(findPortBy, [], 100);
            }
            catch (e) {
                //
            }
            replaceArr.push({
                source: replacePortBy,
                replace: portFound.toString(),
            });
        }
    }
    yield (0, reWriteFile_1.default)(_serviceYamlPath, replaceArr);
    yield (0, reWriteFile_1.default)(_runDockerfilePath, replaceArr);
    yield (0, reWriteFile_1.default)(_buildDockerfilePath, replaceArr);
    yield (0, stringify_yaml_1.stringifyYAML)(_yamlContent, _yamlPath);
    const store = yield (0, get_store_1.default)();
    let data = store.get("services") || [];
    if (!data[serviceName]) {
        data = Object.assign(Object.assign({}, data), { [serviceName]: {
                status: "down",
                platform: null,
                port: null,
                processId: null,
            } });
        store.set("services", data);
    }
    console.log(`Installed ${chalk_1.default.green(serviceName)} service in ${chalk_1.default.green((0, path_1.join)(directoryPath))}`);
    store.save();
});
