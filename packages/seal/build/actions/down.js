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
        define(["require", "exports", "../runners/docker-compose", "./up", "chalk", "./service-down", "../helpers/get-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const docker_compose_1 = __importDefault(require("../runners/docker-compose"));
    const up_1 = require("./up");
    const chalk_1 = __importDefault(require("chalk"));
    const service_down_1 = __importDefault(require("./service-down"));
    const get_store_1 = __importDefault(require("../helpers/get-store"));
    // Stops the seal.compose
    function stopDockerCompose(_yamlContent) {
        return __awaiter(this, void 0, void 0, function* () {
            const filepath = process.cwd();
            const projectName = _yamlContent.project_name;
            // starting seal.compose
            const dockerCompose = new docker_compose_1.default();
            yield dockerCompose.stop(projectName, filepath);
        });
    }
    exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
        const _yamlContent = yield (0, up_1.getAndValidateSealYaml)();
        console.log(`> Stopping ${_yamlContent.project_name}...`);
        const store = yield (0, get_store_1.default)();
        const data = yield store.get("services");
        const servicePromises = [];
        // All the services whose status is down are appended to servicePromises array and later gets resolved
        Object.entries(_yamlContent.services).forEach(([serviceName]) => {
            if (data[serviceName] && data[serviceName].status === "up") {
                servicePromises.push((0, service_down_1.default)(serviceName));
            }
        });
        yield Promise.all(servicePromises);
        console.log(chalk_1.default.green(`\n${_yamlContent.project_name} is down.\n`));
    });
});
