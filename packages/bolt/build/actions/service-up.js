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
        define(["require", "exports", "chalk", "path", "../helpers/docker-info", "../helpers/exit-with-msg", "../helpers/get-store", "../helpers/validate-metadata", "../helpers/validate-services", "../helpers/update-store", "../common", "../constants/bolt-configs", "../runners/docker", "../runners/local"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const path_1 = require("path");
    const docker_info_1 = require("../helpers/docker-info");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const get_store_1 = __importDefault(require("../helpers/get-store"));
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    const update_store_1 = require("../helpers/update-store");
    const common_1 = __importDefault(require("../common"));
    const bolt_configs_1 = require("../constants/bolt-configs");
    const docker_1 = __importDefault(require("../runners/docker"));
    const local_1 = __importDefault(require("../runners/local"));
    class ServiceUp {
        //
        checkIfAlreadyUp(_yamlContent, serviceName) {
            return __awaiter(this, void 0, void 0, function* () {
                const store = yield (0, get_store_1.default)();
                const data = store.get("services") || [];
                const service = data[serviceName];
                if (service && service.status === "up") {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${serviceName}" service is already up on ${service.serviceRunner}`);
                }
            });
        }
        handle(serviceName, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const { serviceRunner } = options;
                if (serviceRunner === "docker") {
                    const isDockerRunning = yield (0, docker_info_1.getDockerStatus)();
                    if (!isDockerRunning) {
                        (0, exit_with_msg_1.exitWithMsg)("Unable to connect with docker!");
                    }
                }
                const { _yamlContent } = yield common_1.default.validateServiceInBoltYaml(serviceName);
                // Validations for metadata and services
                yield (0, validate_metadata_1.validateMetadata)();
                yield (0, validate_services_1.validateServices)();
                yield this.checkIfAlreadyUp(_yamlContent, serviceName);
                const { servicePath, content } = yield common_1.default.getAndValidateService(serviceName, _yamlContent);
                // if service doesn't contain given platform, exit
                if (!content.service_runners[serviceRunner]) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> service ${serviceName}: "${(0, path_1.relative)(".", (0, path_1.join)(servicePath, bolt_configs_1.BOLT.SERVICE_YAML_FILE_NAME))}" doesn't support ${serviceRunner} platform`);
                }
                const { envfile, build, ports, volumes, context } = content.service_runners[serviceRunner];
                // generates .env
                yield common_1.default.generateEnv();
                let PID = null;
                switch (serviceRunner) {
                    case "docker":
                        yield docker_1.default.start(content.container_name, servicePath, build, ports || [], envfile, volumes);
                        PID = content.container_name;
                        break;
                    case "local":
                        PID = yield local_1.default.start(context || servicePath, build, serviceName);
                        break;
                }
                const json = {
                    status: "up",
                    serviceRunner: serviceRunner,
                    port: ports,
                    processId: PID,
                };
                yield (0, update_store_1.updateStore)("services", serviceName, json);
                yield (0, update_store_1.updateStore)("project_runner", "host");
                console.log(chalk_1.default.green(`\n"${serviceName}" service is up on ${serviceRunner} platform\n`));
            });
        }
    }
    exports.default = ServiceUp;
});
