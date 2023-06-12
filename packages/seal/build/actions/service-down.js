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
        define(["require", "exports", "../runners/local", "../runners/docker", "./service-up", "../helpers/exit-with-msg", "chalk", "../helpers/get-store", "../helpers/update-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const local_1 = __importDefault(require("../runners/local"));
    const docker_1 = __importDefault(require("../runners/docker"));
    const service_up_1 = require("./service-up");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const chalk_1 = __importDefault(require("chalk"));
    const get_store_1 = __importDefault(require("../helpers/get-store"));
    const update_store_1 = require("../helpers/update-store");
    function checkIfAlreadyDown(_yamlContent, serviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield (0, get_store_1.default)();
            const data = store.get("services") || [];
            const service = data[serviceName];
            if (service && service.status === "down") {
                yield (0, exit_with_msg_1.exitWithMsg)(`> "${serviceName}" service is already down`);
            }
            return service;
        });
    }
    exports.default = (serviceName) => __awaiter(void 0, void 0, void 0, function* () {
        const { _yamlPath, _yamlContent } = yield (0, service_up_1.getAndValidate)(serviceName);
        const { servicePath, _serviceYamlPath, _ymlPath, yamlPath, content } = yield (0, service_up_1.getAndValidateService)(serviceName, _yamlContent);
        const service = yield checkIfAlreadyDown(_yamlContent, serviceName);
        if (!service) {
            yield (0, exit_with_msg_1.exitWithMsg)(`> "${serviceName}" service is not running`);
        }
        if (service.platform) {
            const { envfile, build } = content.platforms[service.platform];
            switch (service.platform) {
                case "docker":
                    yield docker_1.default.stop(content.container_name, servicePath, build, [], envfile);
                    break;
                case "local":
                    const processId = Number(service.processId) || 0;
                    yield local_1.default.stop(processId);
                    break;
            }
        }
        const json = {
            status: "down",
            platform: undefined,
            port: undefined,
            processId: undefined,
        };
        yield (0, update_store_1.updateStore)("services", serviceName, json);
        console.log(chalk_1.default.green(`\n"${serviceName}" is down from ${service.platform} platform\n`));
    });
});
