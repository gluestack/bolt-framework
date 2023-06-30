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
        define(["require", "exports", "@gluestack/boltvm", "../common", "../helpers/exit-with-msg", "../helpers/get-store", "../helpers/validate-metadata", "../helpers/validate-services", "../runners/service"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const boltvm_1 = __importDefault(require("@gluestack/boltvm"));
    const common_1 = __importDefault(require("../common"));
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const get_store_1 = __importDefault(require("../helpers/get-store"));
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    const service_1 = __importDefault(require("../runners/service"));
    class Log {
        checkIfServiceIsUp(_yamlContent, serviceName) {
            return __awaiter(this, void 0, void 0, function* () {
                const store = yield (0, get_store_1.default)();
                if (!_yamlContent.services[serviceName]) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${serviceName}" service is not present.`);
                }
                const data = store.get("services") || [];
                const service = data[serviceName];
                if (service && service.status === "down") {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${serviceName}" service is down. Please start the service to see the logs`);
                }
                return service;
            });
        }
        handle(serviceName, option) {
            return __awaiter(this, void 0, void 0, function* () {
                const isFollow = option.follow || false;
                const isVM = option.vm || false;
                const { _yamlContent } = yield common_1.default.validateServiceInBoltYaml(serviceName);
                // Validations for metadata and services
                yield (0, validate_metadata_1.validateMetadata)();
                yield (0, validate_services_1.validateServices)();
                const { servicePath, content } = yield common_1.default.getAndValidateService(serviceName, _yamlContent);
                const service = yield this.checkIfServiceIsUp(_yamlContent, serviceName);
                const currentServiceRunner = service.serviceRunner;
                const store = yield (0, get_store_1.default)();
                const projectRunner = yield store.get("project_runner");
                if (projectRunner === "none") {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${serviceName}" is not running`);
                }
                if (isVM && projectRunner !== "vm") {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${serviceName}" is not running on vm`);
                }
                if (isVM) {
                    const boltVm = new boltvm_1.default(process.cwd());
                    // Validating boltVm Dependencies
                    yield boltVm.doctor();
                    yield boltVm.log(isFollow);
                    return;
                }
                const serviceRunner = new service_1.default();
                switch (currentServiceRunner) {
                    case "docker":
                        const { envfile, build } = content.service_runners[currentServiceRunner];
                        const dockerConfig = {
                            containerName: content.container_name,
                            servicePath: servicePath,
                            build: build,
                            envFile: envfile,
                            ports: [],
                            volumes: [],
                            isFollow: isFollow,
                        };
                        yield serviceRunner.docker(dockerConfig, { action: "logs" });
                        break;
                    case "local":
                        const localConfig = {
                            servicePath: servicePath,
                            serviceName: serviceName,
                            build: content.service_runners[currentServiceRunner].build,
                            isFollow: isFollow,
                            processId: 0,
                        };
                        serviceRunner.local(localConfig, { action: "logs" });
                        break;
                    default:
                        yield (0, exit_with_msg_1.exitWithMsg)(">> Platform not supported");
                }
            });
        }
    }
    exports.default = Log;
});
