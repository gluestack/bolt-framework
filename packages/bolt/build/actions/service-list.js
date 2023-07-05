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
        define(["require", "exports", "@gluestack/helpers", "lodash", "path", "../constants/bolt-configs", "../helpers/exit-with-msg", "../helpers/fs-exists", "../helpers/get-store", "../helpers/parse-yaml", "../helpers/validate-metadata", "../helpers/validate-services", "../validations/bolt"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const helpers_1 = require("@gluestack/helpers");
    const lodash_1 = require("lodash");
    const path_1 = require("path");
    const bolt_configs_1 = require("../constants/bolt-configs");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const fs_exists_1 = require("../helpers/fs-exists");
    const get_store_1 = __importDefault(require("../helpers/get-store"));
    const parse_yaml_1 = require("../helpers/parse-yaml");
    const validate_metadata_1 = require("../helpers/validate-metadata");
    const validate_services_1 = require("../helpers/validate-services");
    const bolt_1 = require("../validations/bolt");
    class List {
        handle() {
            return __awaiter(this, void 0, void 0, function* () {
                const _yamlPath = (0, path_1.join)(bolt_configs_1.BOLT.YAML_FILE_NAME);
                if (!(yield (0, fs_exists_1.exists)(_yamlPath))) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${_yamlPath}" doesn't exists`);
                }
                const _yamlContent = yield (0, bolt_1.validateBolt)(yield (0, parse_yaml_1.parseYAML)(_yamlPath));
                if (!_yamlContent ||
                    !_yamlContent.services ||
                    (0, lodash_1.isEmpty)(_yamlContent.services)) {
                    yield (0, exit_with_msg_1.exitWithMsg)(`>> "${bolt_configs_1.BOLT.YAML_FILE_NAME}" services does not exists`);
                }
                // Validations for metadata and services
                yield (0, validate_metadata_1.validateMetadata)();
                yield (0, validate_services_1.validateServices)();
                const store = yield (0, get_store_1.default)();
                const data = store.get("services") || [];
                const head = [
                    "#",
                    "Service Name",
                    "Status",
                    "Service Runner",
                    "Port",
                    "ProcessId",
                ];
                const rows = [];
                let counter = 0;
                Object.keys(data).forEach((key) => {
                    var _a;
                    if (!_yamlContent.services[key]) {
                        return;
                    }
                    counter++;
                    let port;
                    if (data[key].port) {
                        const portNumbers = (_a = data[key].port) === null || _a === void 0 ? void 0 : _a.map((port) => port.split(":")[0]);
                        port = portNumbers === null || portNumbers === void 0 ? void 0 : portNumbers.join("\n");
                    }
                    rows.push([
                        counter || "NA",
                        key || "NA",
                        data[key].status || "NA",
                        data[key].serviceRunner || "NA",
                        port || "NA",
                        data[key].processId || "NA",
                    ]);
                });
                helpers_1.ConsoleTable.print(head, rows);
            });
        }
    }
    exports.default = List;
});
