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
        define(["require", "exports", "chalk", "../helpers/exit-with-msg", "../helpers/get-store", "../helpers/validate-metadata", "../helpers/validate-services", "../common", "../runners/service"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const get_store_1 = __importDefault(require("../helpers/get-store"));
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    const common_1 = __importDefault(require("../common"));
    const service_1 = __importDefault(require("../runners/service"));
    class ServiceDown {
        checkIfAlreadyDown(_yamlContent, serviceName) {
            return __awaiter(this, void 0, void 0, function* () {
                const store = yield (0, get_store_1.default)();
                const data = store.get("services") || [];
                const service = data[serviceName];
                if (service && service.status === "down") {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${serviceName}" service is already down`);
                }
                return service;
            });
        }
        handle(serviceName) {
            return __awaiter(this, void 0, void 0, function* () {
                const { _yamlContent } = yield common_1.default.validateServiceInBoltYaml(serviceName);
                // Validations for metadata and services
                yield (0, validate_metadata_1.validateMetadata)();
                yield (0, validate_services_1.validateServices)();
                const { servicePath, content } = yield common_1.default.getAndValidateService(serviceName, _yamlContent);
                const service = yield this.checkIfAlreadyDown(_yamlContent, serviceName);
                const currentServiceRunner = service.serviceRunner;
                if (!service || !currentServiceRunner) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${serviceName}" service is not running`);
                    return;
                }
                const serviceRunner = new service_1.default();
                switch (currentServiceRunner) {
                    case "docker":
                        const { envfile, build } = content.service_runners.docker;
                        const dockerConfig = {
                            containerName: content.container_name,
                            servicePath: servicePath,
                            build: build,
                            envFile: envfile,
                            ports: [],
                            volumes: [],
                        };
                        yield serviceRunner.docker(dockerConfig, {
                            action: "stop",
                            serviceName: serviceName,
                        });
                        break;
                    case "local":
                        const processId = Number(service.processId) || 0;
                        const { build: localBuild } = content.service_runners.local;
                        const localConfig = {
                            servicePath: servicePath,
                            build: localBuild,
                            processId: processId,
                            ports: [],
                        };
                        yield serviceRunner.local(localConfig, {
                            action: "stop",
                            serviceName: serviceName,
                        });
                        break;
                    case "vmlocal":
                        const vmConfig = {
                            serviceContent: content,
                            serviceName: serviceName,
                            cache: false,
                            runnerType: "vmlocal",
                        };
                        yield serviceRunner.vm(vmConfig, {
                            action: "stop",
                            serviceName: serviceName,
                        });
                        break;
                    case "vmdocker":
                        const vmDockerConfig = {
                            serviceContent: content,
                            serviceName: serviceName,
                            cache: false,
                            runnerType: "vmdocker",
                        };
                        yield serviceRunner.vm(vmDockerConfig, {
                            action: "stop",
                            serviceName: serviceName,
                        });
                        break;
                }
                console.log(chalk_1.default.green(`\n"${serviceName}" is down from ${currentServiceRunner} platform\n`));
            });
        }
    }
    exports.default = ServiceDown;
});
