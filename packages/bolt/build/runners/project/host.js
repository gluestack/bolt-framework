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
        define(["require", "exports", "../../actions/service-up", "../../actions/service-down", "../../common", "../../helpers/get-store", "../../helpers/get-store-data", "../../helpers/update-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const service_up_1 = __importDefault(require("../../actions/service-up"));
    const service_down_1 = __importDefault(require("../../actions/service-down"));
    const common_1 = __importDefault(require("../../common"));
    const get_store_1 = __importDefault(require("../../helpers/get-store"));
    const get_store_data_1 = require("../../helpers/get-store-data");
    const update_store_1 = require("../../helpers/update-store");
    class ProjectRunnerHost {
        constructor(_yamlContent) {
            this._yamlContent = _yamlContent;
        }
        // Resolves the service runner
        resolveServiceRunner(defaultServiceRunner, providedRunner) {
            if (providedRunner.includes(defaultServiceRunner)) {
                return defaultServiceRunner;
            }
            else {
                return providedRunner[0];
            }
        }
        up() {
            return __awaiter(this, void 0, void 0, function* () {
                const data = yield (0, get_store_data_1.getStoreData)("services");
                const _yamlContent = this._yamlContent;
                const serviceRunner = _yamlContent.default_service_runner;
                const servicePromises = [];
                // Creating an instance of ServiceUp class
                const boltServiceUp = new service_up_1.default();
                // Looping through all services in bolt.yaml
                Object.entries(_yamlContent.services).forEach(([serviceName]) => __awaiter(this, void 0, void 0, function* () {
                    // If service is already up, skip
                    if (data[serviceName] && data[serviceName].status !== "down") {
                        return;
                    }
                    // Validating and getting content from bolt.service.yaml
                    const { content } = yield common_1.default.getAndValidateService(serviceName, _yamlContent);
                    // Pushing the services in a Promise array to run them in parallel
                    servicePromises.push(boltServiceUp.handle(serviceName, {
                        serviceRunner: this.resolveServiceRunner(serviceRunner, Object.keys(content.service_runners)),
                        ports: [],
                    }));
                }));
                // Running all services in parallel
                yield Promise.all(servicePromises);
                // Updating the store
                yield (0, update_store_1.updateStore)("project_runner", "host");
            });
        }
        down() {
            return __awaiter(this, void 0, void 0, function* () {
                const store = yield (0, get_store_1.default)();
                const data = yield store.get("services");
                const servicePromises = [];
                const yamlContent = this._yamlContent;
                // Creating an instance of ServiceUp class
                const boltServiceDown = new service_down_1.default();
                // All the services whose status is down are appended to servicePromises array and later gets resolved
                Object.entries(yamlContent.services).forEach(([serviceName]) => {
                    // If service is already down, skip
                    if (data[serviceName] && data[serviceName].status !== "up") {
                        return;
                    }
                    // Pushing the services in a Promise array to shut down them in parallel
                    servicePromises.push(boltServiceDown.handle(serviceName));
                });
                // Shutting down all services in parallel
                yield Promise.all(servicePromises);
                // Updating the store
                yield (0, update_store_1.updateStore)("project_runner", "none");
            });
        }
    }
    exports.default = ProjectRunnerHost;
});
