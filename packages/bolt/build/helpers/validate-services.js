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
        define(["require", "exports", "chalk", "../common", "./exit-with-msg", "./get-store", "./update-all-services-status", "./update-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateServices = void 0;
    const chalk_1 = __importDefault(require("chalk"));
    const common_1 = __importDefault(require("../common"));
    const exit_with_msg_1 = require("./exit-with-msg");
    const get_store_1 = __importDefault(require("./get-store"));
    const update_all_services_status_1 = require("./update-all-services-status");
    const update_store_1 = require("./update-store");
    const validateServices = (option) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let _yamlContent = yield common_1.default.getAndValidateBoltYaml();
            const store = yield (0, get_store_1.default)();
            const data = store.get("services");
            const vmStatus = yield store.get("vm");
            if (!vmStatus) {
                (0, update_store_1.updateStore)("vm", "down");
            }
            const json = {
                status: "down",
                serviceRunner: null,
                projectRunner: null,
                port: null,
                processId: null,
            };
            if (!data) {
                console.log(`Services not found in metadata! Updating...`);
                yield (0, update_all_services_status_1.updateAllServicesStatus)(_yamlContent, json, { reset: true });
                console.log(`Services updated!`);
                return;
            }
            Object.entries(_yamlContent.services).forEach(([serviceName]) => {
                if (!data[serviceName]) {
                    console.log(`${chalk_1.default.green(serviceName)} service not found in metadata! Updating...`);
                    (0, update_store_1.updateStore)("services", serviceName, json);
                    console.log(`Updated ${chalk_1.default.green(serviceName)} service!`);
                }
            });
        }
        catch (error) {
            (0, exit_with_msg_1.exitWithMsg)(`Error while validating metatdata, ${error}`);
        }
    });
    exports.validateServices = validateServices;
});
