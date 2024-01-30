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
        define(["require", "exports", "../../exit-with-msg", "../apis/api-request"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deploy = void 0;
    const exit_with_msg_1 = require("../../exit-with-msg");
    const api_request_1 = require("../apis/api-request");
    const deploy = ({ fileId, projectId, userId, }) => __awaiter(void 0, void 0, void 0, function* () {
        // submits the deployment
        try {
            const { data } = yield (0, api_request_1.apiRequest)({
                method: "POST",
                data: {
                    file_id: fileId,
                    project_id: projectId,
                    user_id: userId,
                },
                route: "/deploy",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!data || !data.success || !data.data.id) {
                (0, exit_with_msg_1.exitWithMsg)("> Failed to create deployment:", data);
            }
            return data.data;
        }
        catch (error) {
            console.log("Error", error);
            yield (0, exit_with_msg_1.exitWithMsg)("Error creating deployment!");
        }
    });
    exports.deploy = deploy;
});
