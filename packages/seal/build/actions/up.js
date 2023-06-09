"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAndValidateSealYaml = void 0;
const path_1 = require("path");
const fs_exists_1 = require("../helpers/fs-exists");
const parse_yaml_1 = require("../helpers/parse-yaml");
const exit_with_msg_1 = require("../helpers/exit-with-msg");
const lodash_1 = require("lodash");
const seal_1 = require("../validations/seal");
const docker_compose_1 = __importDefault(require("../runners/docker-compose"));
const service_up_1 = __importStar(require("./service-up"));
const chalk_1 = __importDefault(require("chalk"));
const generate_routes_1 = __importDefault(require("../helpers/generate-routes"));
const execute_1 = require("../helpers/execute");
const get_store_1 = __importDefault(require("../helpers/get-store"));
function getAndValidateSealYaml() {
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
        return _yamlContent;
    });
}
exports.getAndValidateSealYaml = getAndValidateSealYaml;
// Creates the seal.compose file
function createDockerCompose(_yamlContent, ports) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const dockerCompose = new docker_compose_1.default();
        try {
            // Gather all the availables services
            for (var _d = true, _e = __asyncValues(Object.entries(_yamlContent.services)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                _c = _f.value;
                _d = false;
                try {
                    const [serviceName, service] = _c;
                    const { servicePath, _serviceYamlPath, _ymlPath, yamlPath, content } = yield (0, service_up_1.getAndValidateService)(serviceName, _yamlContent);
                    yield dockerCompose.addService(_yamlContent.project_name, serviceName, servicePath, content.platforms[_yamlContent.default_runner]);
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        yield dockerCompose.addNginx(ports);
        yield dockerCompose.generate();
    });
}
// Starts the seal.compose
function startDockerCompose(_yamlContent) {
    return __awaiter(this, void 0, void 0, function* () {
        // constructing the path to engine's router
        const filepath = process.cwd();
        const projectName = _yamlContent.project_name;
        // starting docker compose
        const dockerCompose = new docker_compose_1.default();
        yield dockerCompose.start(projectName, filepath);
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
// Starts the services when the default runner is local
function startServiceOnLocal(serviceName, _yamlContent) {
    return __awaiter(this, void 0, void 0, function* () {
        // Getting the service details and validating it
        const { servicePath, _serviceYamlPath, _ymlPath, yamlPath, content } = yield (0, service_up_1.getAndValidateService)(serviceName, _yamlContent);
        if (content.platforms["local"]) {
            yield (0, service_up_1.default)(serviceName, { platform: "local", ports: [] });
        }
        else {
            yield (0, service_up_1.default)(serviceName, { platform: "docker", ports: [] });
        }
    });
}
function startServiceOnDocker(serviceName, _yamlContent) {
    return __awaiter(this, void 0, void 0, function* () {
        // Getting the service details and validating it
        const { servicePath, _serviceYamlPath, _ymlPath, yamlPath, content } = yield (0, service_up_1.getAndValidateService)(serviceName, _yamlContent);
        if (!content.platforms["docker"]) {
            yield (0, service_up_1.default)(serviceName, { platform: "local", ports: [] });
        }
        else {
            yield (0, service_up_1.default)(serviceName, { platform: "docker", ports: [] });
        }
    });
}
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const _yamlContent = yield getAndValidateSealYaml();
    // 1. generates routes
    console.log(`> Creating Ingress ${_yamlContent.project_name}...`);
    const ports = yield (0, generate_routes_1.default)(_yamlContent);
    // 2. generates .env
    yield generateEnv();
    const store = yield (0, get_store_1.default)();
    const data = store.get("services") || [];
    if (!_yamlContent.default_runner) {
        console.log(chalk_1.default.red("Please Specify a default runner for the app."));
        process.exit();
    }
    const runner = _yamlContent.default_runner;
    const servicePromises = [];
    switch (runner) {
        case "docker":
            // All the services whose status is down are appended to servicePromises array and later gets resolved
            Object.entries(_yamlContent.services).forEach(([serviceName]) => {
                if (data[serviceName] && data[serviceName].status === "down") {
                    servicePromises.push(startServiceOnDocker(serviceName, _yamlContent));
                }
            });
            yield Promise.all(servicePromises);
            process.exit(0);
            break;
        case "local":
            // All the services whose status is down are appended to servicePromises array and later gets resolved
            Object.entries(_yamlContent.services).forEach(([serviceName]) => {
                if (data[serviceName] && data[serviceName].status === "down") {
                    servicePromises.push(startServiceOnLocal(serviceName, _yamlContent));
                }
            });
            yield Promise.all(servicePromises);
            process.exit(0);
            break;
        default: {
            (0, exit_with_msg_1.exitWithMsg)(`> "${_yamlContent.default_runner}" runner not supported.`);
        }
    }
});
