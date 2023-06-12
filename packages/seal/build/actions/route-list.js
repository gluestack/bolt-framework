var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./up", "@gluestack/helpers", "../helpers/exit-with-msg"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const up_1 = require("./up");
    const helpers_1 = require("@gluestack/helpers");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
        const _yamlContent = yield (0, up_1.getAndValidateSealYaml)();
        if (!_yamlContent.ingress || _yamlContent.ingress.length === 0) {
            return (0, exit_with_msg_1.exitWithMsg)("> No ingress found in config. Skipping route generation...");
        }
        const rows = [];
        const head = [
            "Domain",
            "Port",
            "Location",
            "Proxy Pass",
            "Rewrite Key",
            "Rewrite Value",
            "Client MaxBody (in MB)",
        ];
        _yamlContent.ingress.forEach((ingress) => {
            const domain = ingress.domain || undefined;
            const port = ingress.port || undefined;
            if (!domain || !port) {
                console.log("> No domain or port found in config");
                return;
            }
            ingress.options.forEach((option) => {
                const { location, rewrite_key, rewrite_value, proxy_pass } = option;
                if (!location || !rewrite_key || !rewrite_value || !proxy_pass) {
                    console.log("> Missing required option in ingress config");
                    return;
                }
                const client_max_body_size = option.client_max_body_size || 50;
                rows.push([
                    domain,
                    `${port}`,
                    location,
                    proxy_pass,
                    rewrite_key,
                    rewrite_value,
                    `${client_max_body_size}`,
                ]);
            });
        });
        yield helpers_1.ConsoleTable.print(head, rows);
    });
});
