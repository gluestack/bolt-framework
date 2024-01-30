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
        define(["require", "exports", "fs", "form-data", "../apis/api-request"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.upload = void 0;
    const fs_1 = require("fs");
    const inquirer = require("inquirer");
    const form_data_1 = __importDefault(require("form-data"));
    const api_request_1 = require("../apis/api-request");
    const upload = (filepath, store) => __awaiter(void 0, void 0, void 0, function* () {
        // upload the project zip file to minio
        try {
            const form = new form_data_1.default();
            form.append("file", (0, fs_1.createReadStream)(filepath));
            const { data } = yield (0, api_request_1.apiRequest)({
                method: "POST",
                route: "/upload",
                data: form,
                headers: Object.assign({}, form.getHeaders()),
            });
            if (!data.success || !data.data || !data.data.id) {
                console.error("Error uploading the project zip file to minio");
                process.exit(1);
            }
            const fileId = data.data.id;
            (0, fs_1.unlinkSync)(filepath);
            return fileId;
        }
        catch (error) {
            console.log("> Uploading failed due to following reason:", error.message || error);
            console.log(error);
            process.exit(-1);
        }
    });
    exports.upload = upload;
});
