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
        define(["require", "exports", "../helpers/exit-with-msg", "../helpers/get-store", "../runners/docker", "../runners/local", "./service-up"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const get_store_1 = __importDefault(require("../helpers/get-store"));
    const docker_1 = __importDefault(require("../runners/docker"));
    const local_1 = __importDefault(require("../runners/local"));
    const service_up_1 = require("./service-up");
    function checkIfServiceIsUp(_yamlContent, serviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield (0, get_store_1.default)();
            if (!_yamlContent.services[serviceName]) {
                yield (0, exit_with_msg_1.exitWithMsg)(`> "${serviceName}" service is not present.`);
            }
            const data = store.get("services") || [];
            const service = data[serviceName];
            if (service && service.status === "down") {
                yield (0, exit_with_msg_1.exitWithMsg)(`> "${serviceName}" service is down. Please start the service to see the logs`);
            }
            return service;
        });
    }
    exports.default = (serviceName, option) => __awaiter(void 0, void 0, void 0, function* () {
        const isFollow = option.follow || false;
        const { _yamlPath, _yamlContent } = yield (0, service_up_1.getAndValidate)(serviceName);
        const { servicePath, _serviceYamlPath, _ymlPath, yamlPath, content } = yield (0, service_up_1.getAndValidateService)(serviceName, _yamlContent);
        const service = yield checkIfServiceIsUp(_yamlContent, serviceName);
        if (!service) {
            yield (0, exit_with_msg_1.exitWithMsg)(`> "${serviceName}" service is not running`);
        }
        if (service.platform) {
            const { envfile, build } = content.platforms[service.platform];
            switch (service.platform) {
                case "docker":
                    yield docker_1.default.logs(content.container_name, servicePath, build, [], envfile, isFollow);
                    break;
                case "local":
                    yield local_1.default.logs(serviceName, servicePath, isFollow);
                    break;
            }
        }
    });
});
