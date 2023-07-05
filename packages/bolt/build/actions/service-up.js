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
        define(["require", "exports", "chalk", "../helpers/docker-info", "../helpers/exit-with-msg", "../helpers/get-store", "../helpers/validate-metadata", "../helpers/validate-services", "../common", "../runners/service"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const docker_info_1 = require("../helpers/docker-info");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const get_store_1 = __importDefault(require("../helpers/get-store"));
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    const common_1 = __importDefault(require("../common"));
    const service_1 = __importDefault(require("../runners/service"));
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
        validateServiceRunnerConfig(content, serviceRunnerKey) {
            const config = content.service_runners[serviceRunnerKey];
            if (!config) {
                return false;
            }
            return true;
        }
        handle(serviceName, options) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let { serviceRunner: srOption, cache } = options;
                    // Validations for metadata and services
                    yield (0, validate_metadata_1.validateMetadata)();
                    yield (0, validate_services_1.validateServices)();
                    if (srOption === "docker") {
                        const isDockerRunning = yield (0, docker_info_1.getDockerStatus)();
                        if (!isDockerRunning) {
                            (0, exit_with_msg_1.exitWithMsg)("Unable to connect with docker!");
                        }
                    }
                    const { _yamlContent } = yield common_1.default.validateServiceInBoltYaml(serviceName);
                    yield this.checkIfAlreadyUp(_yamlContent, serviceName);
                    const { servicePath, content } = yield common_1.default.getAndValidateService(serviceName, _yamlContent);
                    if (!content.supported_service_runners.includes(srOption)) {
                        console.log(chalk_1.default.yellow(`>> Given "${srOption}" service runner is not supported for ${serviceName}, using "${content.supported_service_runners[0]}" instead!`));
                        srOption = content.supported_service_runners[0];
                    }
                    // generates .env
                    yield common_1.default.generateEnv();
                    let isConfigValid = false;
                    const serviceRunner = new service_1.default();
                    switch (srOption) {
                        case "local":
                            isConfigValid = this.validateServiceRunnerConfig(content, "local");
                            if (!isConfigValid) {
                                console.log(chalk_1.default.red(`>> No config found for local in bolt.service.yaml`));
                                return;
                            }
                            const localBuild = content.service_runners.local.build;
                            const localConfig = {
                                servicePath: servicePath,
                                build: localBuild,
                                processId: 0,
                            };
                            yield serviceRunner.local(localConfig, {
                                action: "start",
                                serviceName: serviceName,
                            });
                            break;
                        case "docker":
                            isConfigValid = this.validateServiceRunnerConfig(content, "docker");
                            if (!isConfigValid) {
                                console.log(chalk_1.default.red(`>> No config found for docker in bolt.service.yaml`));
                                return;
                            }
                            const { build: dockerBuild, ports, volumes, envfile, } = content.service_runners.docker;
                            const dockerConfig = {
                                containerName: content.container_name,
                                servicePath: servicePath,
                                build: dockerBuild,
                                ports: ports || [],
                                envFile: envfile,
                                volumes: volumes || [],
                            };
                            yield serviceRunner.docker(dockerConfig, {
                                action: "start",
                                serviceName: serviceName,
                            });
                            break;
                        case "vmlocal":
                            isConfigValid = this.validateServiceRunnerConfig(content, "local");
                            if (!isConfigValid) {
                                console.log(chalk_1.default.red(`>> To run service on VM, no config found for local in bolt.service.yaml`));
                                return;
                            }
                            const vmConfig = {
                                serviceContent: content,
                                serviceName: serviceName,
                                cache: cache || false,
                                runnerType: "vmlocal",
                            };
                            yield serviceRunner.vm(vmConfig, {
                                action: "start",
                                serviceName: serviceName,
                            });
                            break;
                        case "vmdocker":
                            isConfigValid = this.validateServiceRunnerConfig(content, "docker");
                            if (!isConfigValid) {
                                console.log(chalk_1.default.red(`>> To run service on vmdocker, no config found for docker in bolt.service.yaml`));
                                return;
                            }
                            const vmdockerConfig = {
                                serviceContent: content,
                                serviceName: serviceName,
                                cache: cache || false,
                                runnerType: "vmdocker",
                            };
                            yield serviceRunner.vm(vmdockerConfig, {
                                action: "start",
                                serviceName: serviceName,
                            });
                            break;
                    }
                    console.log(chalk_1.default.green(`\n"${serviceName}" service is up on ${srOption} platform\n`));
                }
                catch (error) {
                    (0, exit_with_msg_1.exitWithMsg)(`>> Errorwhile running service-up: ${error.message}`);
                }
            });
        }
    }
    exports.default = ServiceUp;
});
