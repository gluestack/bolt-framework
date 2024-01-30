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
        define(["require", "exports", "axios", "../../../config", "../../exit-with-msg"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.auth = void 0;
    const inquirer = require("inquirer");
    const axios_1 = __importDefault(require("axios"));
    const config_1 = require("../../../config");
    const exit_with_msg_1 = require("../../exit-with-msg");
    const auth = (doAuth, store) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            const creds = {
                access_key: store.get("access_key"),
                secret_key: store.get("secret_key"),
            };
            // prompts to collect credentials from users
            if (doAuth || !creds.access_key || !creds.secret_key) {
                const results = yield inquirer.prompt([
                    {
                        name: "access_key",
                        message: "Please enter your access key",
                        type: "input",
                    },
                    {
                        name: "secret_key",
                        message: "Please enter your secret key",
                        type: "input",
                    },
                ]);
                creds.access_key = results.access_key;
                creds.secret_key = results.secret_key;
                // store credentials in the store
                store.set("access_key", results.access_key);
                store.set("secret_key", results.secret_key);
            }
            // authenticate user
            const { data } = yield axios_1.default.request({
                method: "POST",
                url: `${config_1.BOX_SERVER_URL}/deployment/login`,
                data: JSON.stringify(creds),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!data.success) {
                yield (0, exit_with_msg_1.exitWithMsg)("Error authenticating user");
            }
            //  check if user is blocker
            if ((_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.is_blocked) {
                yield (0, exit_with_msg_1.exitWithMsg)("User is blocked");
            }
            const userData = (_c = data.data) === null || _c === void 0 ? void 0 : _c.user;
            const projects = (_e = (_d = data.data) === null || _d === void 0 ? void 0 : _d.user) === null || _e === void 0 ? void 0 : _e.projects;
            // Delete projects from userData object without updating data.data.user.projects
            delete userData.projects;
            // remove projects from the userData object
            // store user details in the store
            store.set("user", userData || "");
            store.save();
            return {
                user: userData,
                projects: projects,
            };
        }
        catch (error) {
            yield (0, exit_with_msg_1.exitWithMsg)("Error authenticating user");
        }
    });
    exports.auth = auth;
});
