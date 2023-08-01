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
        define(["require", "exports", "../../../config", "@gluestack/glue-server-sdk-js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.auth = void 0;
    const inquirer = require("inquirer");
    const config_1 = require("../../../config");
    const glue_server_sdk_js_1 = require("@gluestack/glue-server-sdk-js");
    const auth = (doAuth, store) => __awaiter(void 0, void 0, void 0, function* () {
        const creds = {
            email: store.get("email"),
            password: store.get("password"),
        };
        // prompts to collect credentials from users
        if (doAuth || !creds.email || !creds.password) {
            const results = yield inquirer.prompt([
                {
                    name: "email",
                    message: "Please enter your email",
                    type: "input",
                },
                {
                    name: "password",
                    message: "Please enter your password",
                    type: "password",
                },
            ]);
            creds.email = results.email;
            creds.password = results.password;
            // store credentials in the store
            store.set("email", results.email);
            store.set("password", results.password);
        }
        const glue = new glue_server_sdk_js_1.Glue(config_1.SEAL_DOMAIN);
        const response = yield glue.auth.login(Object.assign(Object.assign({}, creds), { role: "owner" }));
        if (!response || !response.id) {
            console.log(`>> Authentication failed. Message: ${response}`);
            process.exit(-1);
        }
        if (!response.is_verified) {
            console.log(`>> Authentication failed. Message: Account is not verified`);
            process.exit(-1);
        }
        if (response.status === "on_waitlist") {
            console.log(`>> Authentication failed. User is on waitlist`);
            process.exit(-1);
        }
        // store user data in the store
        store.set("team", response.team);
        delete response.team;
        store.set("user", response);
        // save store
        store.save();
    });
    exports.auth = auth;
});
