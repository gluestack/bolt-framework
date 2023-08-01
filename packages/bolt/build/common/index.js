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
        define(["require", "exports", "../helpers/fs-exists", "lodash", "path", "../helpers/exit-with-msg", "../helpers/parse-yaml", "../validations/bolt", "../validations/bolt-service", "chalk", "../helpers/execute", "../constants/bolt-configs", "closest-match"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_exists_1 = require("../helpers/fs-exists");
    const lodash_1 = require("lodash");
    const path_1 = require("path");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const parse_yaml_1 = require("../helpers/parse-yaml");
    const bolt_1 = require("../validations/bolt");
    const bolt_service_1 = require("../validations/bolt-service");
    const chalk_1 = __importDefault(require("chalk"));
    const execute_1 = require("../helpers/execute");
    const bolt_configs_1 = require("../constants/bolt-configs");
    const closest_match_1 = require("closest-match");
    class Common {
        static getAndValidateBoltYaml() {
            return __awaiter(this, void 0, void 0, function* () {
                const _yamlPath = (0, path_1.join)(bolt_configs_1.BOLT.YAML_FILE_NAME);
                if (!(yield (0, fs_exists_1.exists)(_yamlPath))) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${_yamlPath}" doesn't exists`);
                }
                const _yamlContent = yield (0, bolt_1.validateBolt)(yield (0, parse_yaml_1.parseYAML)(_yamlPath));
                if (!(_yamlContent === null || _yamlContent === void 0 ? void 0 : _yamlContent.services) || (0, lodash_1.isEmpty)(_yamlContent.services)) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${bolt_configs_1.BOLT.YAML_FILE_NAME}" services does not exists`);
                }
                return _yamlContent;
            });
        }
        static getAndValidateService(serviceName, _yamlContent) {
            return __awaiter(this, void 0, void 0, function* () {
                // if service doesn't exists, exit
                const servicePath = (0, path_1.join)(process.cwd(), _yamlContent.services[serviceName].path);
                if (!(yield (0, fs_exists_1.exists)(servicePath))) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> service ${(0, path_1.relative)(".", servicePath)} doesn't exists`);
                }
                // check if given service has a bolt.service.yaml file
                const _serviceYamlPath = yield (0, fs_exists_1.exists)((0, path_1.join)(servicePath, "bolt.service.yaml"));
                // if yaml doesn't exists, exit
                if (!_serviceYamlPath) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> service ${(0, path_1.relative)(".", (0, path_1.join)(servicePath, "bolt.service.yaml"))} file doesn't exists`);
                }
                const yamlPath = _serviceYamlPath;
                const content = yield (0, bolt_service_1.validateBoltService)(yield (0, parse_yaml_1.parseYAML)(yamlPath), servicePath);
                return { servicePath, _serviceYamlPath, yamlPath, content };
            });
        }
        static generateEnv() {
            return __awaiter(this, void 0, void 0, function* () {
                const args = ["env:generate"];
                // console.log(chalk.gray("$ bolt", args.join(" ")));
                yield (0, execute_1.execute)("bolt", args, {
                    cwd: process.cwd(),
                    shell: true,
                    stdio: "inherit",
                });
            });
        }
        static validateServiceInBoltYaml(serviceName) {
            return __awaiter(this, void 0, void 0, function* () {
                const _yamlPath = (0, path_1.join)(bolt_configs_1.BOLT.YAML_FILE_NAME);
                if (!(yield (0, fs_exists_1.exists)(_yamlPath))) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${_yamlPath}" doesn't exists`);
                }
                const _yamlContent = yield (0, bolt_1.validateBolt)(yield (0, parse_yaml_1.parseYAML)(_yamlPath));
                if (!_yamlContent ||
                    !_yamlContent.services ||
                    (0, lodash_1.isEmpty)(_yamlContent.services)) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${bolt_configs_1.BOLT.YAML_FILE_NAME}" services does not exists`);
                }
                if (!_yamlContent.services[serviceName]) {
                    const closestWord = (0, closest_match_1.closestMatch)(serviceName, Object.keys(_yamlContent.services));
                    console.log(chalk_1.default.bgRed(`\nUnknown service: "${serviceName}".`), chalk_1.default.cyan(`Did you mean "${closestWord}"?`));
                    yield (0, exit_with_msg_1.exitWithMsg)("");
                }
                return { _yamlPath, _yamlContent };
            });
        }
    }
    exports.default = Common;
});
