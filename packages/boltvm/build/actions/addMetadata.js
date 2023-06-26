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
        define(["require", "exports", "../constants", "../helpers/fs-exists", "../helpers/exit-with-msg", "../helpers/update-store", "../helpers/check-metadata-file", "../helpers/validate-seal-file", "../helpers/get-store", "chalk"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createProject = void 0;
    const constants_1 = require("../constants");
    const fs_exists_1 = require("../helpers/fs-exists");
    const exit_with_msg_1 = require("../helpers/exit-with-msg");
    const update_store_1 = require("../helpers/update-store");
    const check_metadata_file_1 = require("../helpers/check-metadata-file");
    const validate_seal_file_1 = require("../helpers/validate-seal-file");
    const get_store_1 = require("../helpers/get-store");
    const chalk_1 = __importDefault(require("chalk"));
    function createProject(sealConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = {
                projectName: sealConfig.name,
                containerPath: "",
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
            const projectId = sealConfig.projectId;
            if (storeData[projectId]) {
                return storeData[projectId];
            }
            console.log(`>> Creating ${chalk_1.default.green(sealConfig.name)}'s configurations for sealvm...`);
            yield (0, update_store_1.updateStore)("projects", projectId, json);
            console.log(`>> Successfully created ${chalk_1.default.green(sealConfig.name)}'s configurations for sealvm...`);
            return json;
        });
    }
    exports.createProject = createProject;
    exports.default = (localPath) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Validate Path
            if (!(yield (0, fs_exists_1.exists)(localPath))) {
                (0, exit_with_msg_1.exitWithMsg)(">> Please specify correct path in source");
                return;
            }
            // Check for valid sealvm yml file
            const sealConfig = yield (0, validate_seal_file_1.validateSealFile)(localPath);
            // Create SealVM Metadata
            yield (0, check_metadata_file_1.checkMetadataFile)();
            yield createProject(sealConfig);
        }
        catch (error) {
            (0, exit_with_msg_1.exitWithMsg)(`Error while creating ${constants_1.SEALVM.CONFIG_FILE}`, error.message);
        }
    });
});
