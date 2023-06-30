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
        define(["require", "exports", "chalk", "../helpers/get-store", "../helpers/update-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chalk_1 = __importDefault(require("chalk"));
    const get_store_1 = require("../helpers/get-store");
    const update_store_1 = require("../helpers/update-store");
    class Common {
        static createProjectMetadata(boltConfig) {
            return __awaiter(this, void 0, void 0, function* () {
                const json = {
                    projectName: boltConfig.project_name,
                    containerPath: null,
                    sshPort: null,
                    status: "down",
                    vmProcessId: null,
                    mountProcessId: null,
                    sshProcessIds: null,
                    projectRunnerId: null,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };
                const store = yield (0, get_store_1.getStore)();
                const storeData = store.get("projects") || {};
                const projectId = boltConfig.project_id;
                if (storeData[projectId]) {
                    return storeData[projectId];
                }
                console.log(`>> Creating ${chalk_1.default.green(boltConfig.project_name)}'s configurations for boltvm...`);
                yield (0, update_store_1.updateStore)("projects", projectId, json);
                console.log(`>> Successfully created ${chalk_1.default.green(boltConfig.project_name)}'s configurations for boltvm...`);
                return json;
            });
        }
    }
    exports.default = Common;
});
