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
        define(["require", "exports", "chalk", "../common", "../helpers/exit-with-msg", "../helpers/get-store", "../helpers/validate-metadata", "../helpers/validate-services", "../runners/docker", "../runners/local"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const common_1 = __importDefault(require("../common"));
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const get_store_1 = __importDefault(require("../helpers/get-store"));
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    const docker_1 = __importDefault(require("../runners/docker"));
    const local_1 = __importDefault(require("../runners/local"));
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
                const serviceRunner = service.serviceRunner;
                // if (isVM && serviceRunner !== "vm") {
                //   await exitWithMsg(`>> "${serviceName}" is not running on vm`);
                // }
                if (isVM) {
                    console.log(chalk_1.default.green("coming soon..."));
                    process.exit();
                    //   await getVmLogs(".", { follow: isFollow });
                    return;
                }
                switch (serviceRunner) {
                    case "docker":
                        const { envfile, build } = content.service_runners[serviceRunner];
                        yield docker_1.default.logs(content.container_name, servicePath, build, [], envfile, isFollow);
                        break;
                    case "local":
                        yield local_1.default.logs(serviceName, servicePath, isFollow);
                        break;
                    // case "vm":
                    //   const vmConfig = _yamlContent.server.vm;
                    //   await validateVmConfig(vmConfig);
                    //   const logFolderPath = join(`.logs`, `${vmConfig.name}`);
                    //   await getLogs(serviceName, servicePath, isFollow, logFolderPath);
                    // break;
                    default:
                        yield (0, exit_with_msg_1.exitWithMsg)(">> Platform not supported");
                }
            });
        }
    }
    exports.default = Log;
});
