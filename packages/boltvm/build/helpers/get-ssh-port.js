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
        define(["require", "exports", "./get-store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSSHPort = void 0;
    const get_store_1 = require("./get-store");
    const getSSHPort = () => __awaiter(void 0, void 0, void 0, function* () {
        const store = yield (0, get_store_1.getStore)();
        const data = store.get("projects");
        let sshPort = [];
        for (let project in data) {
            if (data[project].sshPort) {
                sshPort.push(data[project].sshPort);
            }
        }
        if (sshPort.length !== 0) {
            sshPort.sort((a, b) => a - b);
            const port = sshPort[sshPort.length - 1] + 1;
            return port;
        }
        return 2222;
    });
    exports.getSSHPort = getSSHPort;
});
