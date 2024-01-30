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
        define(["require", "exports", "../../get-store-data", "axios", "../../../config"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.apiRequest = void 0;
    const get_store_data_1 = require("../../get-store-data");
    const axios_1 = __importDefault(require("axios"));
    const config_1 = require("../../../config");
    const apiRequest = ({ data, method, route, params, headers, }) => __awaiter(void 0, void 0, void 0, function* () {
        const accessKey = yield (0, get_store_data_1.getStoreData)("access_key");
        const secretKey = yield (0, get_store_data_1.getStoreData)("secret_key");
        const requestHeaders = Object.assign({ ["Access-Key"]: accessKey, ["Secret-Key"]: secretKey }, headers);
        params = params ? getParamString(params) : "";
        const config = {
            method: method,
            url: `${config_1.BOX_SERVER_URL}/deployment${route}${params}`,
            headers: requestHeaders,
            data: data,
        };
        return yield axios_1.default.request(config);
    });
    exports.apiRequest = apiRequest;
    const getParamString = (params) => {
        let paramString = "?";
        for (const [key, value] of Object.entries(params)) {
            paramString += `${key}=${value}&`;
        }
        return paramString;
    };
});
