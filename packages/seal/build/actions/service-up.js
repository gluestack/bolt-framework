var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
        define(["require", "exports", "path", "fs/promises", "../helpers/fs-exists", "../helpers/parse-yaml", "../helpers/exit-with-msg", "../validations/seal-service", "../runners/local", "../runners/docker", "lodash", "../validations/seal", "closest-match", "chalk", "os", "../helpers/fs-readfile-json", "../helpers/execute", "../helpers/get-store", "../helpers/update-store", "../helpers/docker-info"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAndValidateService = exports.getAndValidate = void 0;
    const path_1 = require("path");
    const promises_1 = require("fs/promises");
    const fs_exists_1 = require("../helpers/fs-exists");
    const parse_yaml_1 = require("../helpers/parse-yaml");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const seal_service_1 = require("../validations/seal-service");
    const local_1 = __importDefault(require("../runners/local"));
    const docker_1 = __importDefault(require("../runners/docker"));
    const lodash_1 = require("lodash");
    const seal_1 = require("../validations/seal");
    const closest_match_1 = require("closest-match");
    const chalk_1 = __importDefault(require("chalk"));
    const os = __importStar(require("os"));
    const fs_readfile_json_1 = require("../helpers/fs-readfile-json");
    const execute_1 = require("../helpers/execute");
    const get_store_1 = __importDefault(require("../helpers/get-store"));
    const update_store_1 = require("../helpers/update-store");
    const docker_info_1 = require("../helpers/docker-info");
    function getAndValidate(serviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const _yamlPath = (0, path_1.join)("seal.yaml");
            if (!(yield (0, fs_exists_1.exists)(_yamlPath))) {
                yield (0, exit_with_msg_1.exitWithMsg)(`> "${_yamlPath}" doesn't exists`);
            }
            const _yamlContent = yield (0, seal_1.validateSeal)(yield (0, parse_yaml_1.parseYAML)(_yamlPath));
            if (!_yamlContent ||
                !_yamlContent.services ||
                (0, lodash_1.isEmpty)(_yamlContent.services)) {
                yield (0, exit_with_msg_1.exitWithMsg)(`> "seal.yaml" services does not exists`);
            }
            if (!_yamlContent.services[serviceName]) {
                const closestWord = (0, closest_match_1.closestMatch)(serviceName, Object.keys(_yamlContent.services));
                console.log(chalk_1.default.bgRed(`\nUnknown service: "${serviceName}".`), chalk_1.default.cyan(`Did you mean "${closestWord}"?`));
                yield (0, exit_with_msg_1.exitWithMsg)("");
            }
            return { _yamlPath, _yamlContent };
        });
    }
    exports.getAndValidate = getAndValidate;
    function getAndValidateService(serviceName, _yamlContent) {
        return __awaiter(this, void 0, void 0, function* () {
            // if service doesn't exists, exit
            const servicePath = (0, path_1.join)(process.cwd(), _yamlContent.services[serviceName].path);
            if (!(yield (0, fs_exists_1.exists)(servicePath))) {
                yield (0, exit_with_msg_1.exitWithMsg)(`> service ${(0, path_1.relative)(".", servicePath)} doesn't exists`);
            }
            // check if given service has a seal.service.yaml file
            const _serviceYamlPath = yield (0, fs_exists_1.exists)((0, path_1.join)(servicePath, "seal.service.yaml"));
            const _ymlPath = yield (0, fs_exists_1.exists)((0, path_1.join)(servicePath, "seal.service.yaml"));
            // if yaml doesn't exists, exit
            if (!_serviceYamlPath && !_ymlPath) {
                yield (0, exit_with_msg_1.exitWithMsg)(`> service ${(0, path_1.relative)(".", (0, path_1.join)(servicePath, "seal.service.yaml"))} file doesn't exists`);
            }
            const yamlPath = (_serviceYamlPath ? _serviceYamlPath : _ymlPath);
            const content = yield (0, seal_service_1.validateSealService)(yield (0, parse_yaml_1.parseYAML)(yamlPath));
            return { servicePath, _serviceYamlPath, _ymlPath, yamlPath, content };
        });
    }
    exports.getAndValidateService = getAndValidateService;
    function checkIfAnotherProjectIsUp(_yamlContent) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const _sealFolderPath = (0, path_1.join)(os.homedir(), ".seal");
            const files = yield (0, promises_1.readdir)(_sealFolderPath);
            try {
                for (var _d = true, files_1 = __asyncValues(files), files_1_1; files_1_1 = yield files_1.next(), _a = files_1_1.done, !_a;) {
                    _c = files_1_1.value;
                    _d = false;
                    try {
                        const file = _c;
                        if (!file.endsWith(".json") || file === "projects.json") {
                            continue;
                        }
                        if (file !== `${_yamlContent.project_id}.json`) {
                            const data = (yield (0, fs_readfile_json_1.readfile)((0, path_1.join)(_sealFolderPath, file))) || [];
                            const serviceUp = (0, lodash_1.find)(data, { status: "up" });
                            if (serviceUp) {
                                yield (0, exit_with_msg_1.exitWithMsg)(`> seal project with ID: ${file.split(".")[0]} is already up`);
                            }
                        }
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = files_1.return)) yield _b.call(files_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    function checkIfAlreadyUp(_yamlContent, serviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield (0, get_store_1.default)();
            const data = store.get("services") || [];
            const service = data[serviceName];
            if (service && service.status === "up") {
                yield (0, exit_with_msg_1.exitWithMsg)(`> "${serviceName}" service is already up on ${service.platform}`);
            }
        });
    }
    function generateEnv() {
        return __awaiter(this, void 0, void 0, function* () {
            const args = ["env:generate"];
            console.log(chalk_1.default.gray("$ seal", args.join(" ")));
            yield (0, execute_1.execute)("seal", args, {
                cwd: process.cwd(),
                shell: true,
            });
        });
    }
    exports.default = (serviceName, options) => __awaiter(void 0, void 0, void 0, function* () {
        const { platform } = options;
        if (platform === "docker") {
            const isDockerRunning = yield (0, docker_info_1.getDockerStatus)();
            if (!isDockerRunning) {
                console.log(chalk_1.default.red("Unable to connect with docker!"));
                process.exit();
            }
        }
        const { _yamlPath, _yamlContent } = yield getAndValidate(serviceName);
        yield checkIfAlreadyUp(_yamlContent, serviceName);
        const { servicePath, _serviceYamlPath, _ymlPath, yamlPath, content } = yield getAndValidateService(serviceName, _yamlContent);
        // if service doesn't contain given platform, exit
        if (!content.platforms[platform]) {
            yield (0, exit_with_msg_1.exitWithMsg)(`> service ${serviceName}: "${(0, path_1.relative)(".", (0, path_1.join)(servicePath, "seal.service.yaml"))}" doesn't support ${platform} platform`);
        }
        const { envfile, build, ports, volumes, context } = content.platforms[platform];
        // generates .env
        yield generateEnv();
        let PID = null;
        switch (platform) {
            case "docker":
                yield docker_1.default.start(content.container_name, servicePath, build, ports || [], envfile, volumes);
                PID = content.container_name;
                break;
            case "local":
                PID = yield local_1.default.start(context || servicePath, build);
                break;
        }
        const json = {
            status: "up",
            platform: platform,
            port: ports,
            processId: PID,
        };
        yield (0, update_store_1.updateStore)("services", serviceName, json);
        console.log(chalk_1.default.green(`\n"${serviceName}" service is up on ${platform} platform\n`));
    });
});
