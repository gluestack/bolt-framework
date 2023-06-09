"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_exists_1 = require("../helpers/fs-exists");
const parse_yaml_1 = require("../helpers/parse-yaml");
const exit_with_msg_1 = require("../helpers/exit-with-msg");
const lodash_1 = require("lodash");
const seal_1 = require("../validations/seal");
const helpers_1 = require("@gluestack/helpers");
const get_store_1 = __importDefault(require("../helpers/get-store"));
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const _yamlPath = (0, path_1.join)("seal.yaml");
    if (!(yield (0, fs_exists_1.exists)(_yamlPath))) {
        yield (0, exit_with_msg_1.exitWithMsg)(`> "${_yamlPath}" doesn't exists`);
    }
    const _yamlContent = yield (0, seal_1.validateSeal)(yield (0, parse_yaml_1.parseYAML)(_yamlPath));
    if (!_yamlContent ||
        !_yamlContent.services ||
        (0, lodash_1.isEmpty)(_yamlContent.services)) {
        yield (0, exit_with_msg_1.exitWithMsg)(`> "seal.yaml" services does not exists`);
    }
    const store = yield (0, get_store_1.default)();
    const data = store.get("services") || [];
    const head = [
        "#",
        "Service Name",
        "Status",
        "Platform",
        "Port",
        "ProcessId",
    ];
    const rows = [];
    let counter = 0;
    Object.keys(data).forEach((key) => {
        if (_yamlContent.services[key]) {
            counter++;
            let port;
            if (data[key].port) {
                const portNumbers = data[key].port.map((port) => port.split(":")[0]);
                port = portNumbers === null || portNumbers === void 0 ? void 0 : portNumbers.join("\n");
            }
            rows.push([
                counter || "NA",
                key || "NA",
                data[key].status || "NA",
                data[key].platform || "NA",
                port || "NA",
                data[key].processId || "NA",
            ]);
        }
    });
    helpers_1.ConsoleTable.print(head, rows);
});
