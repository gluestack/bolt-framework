(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "node:child_process"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.execute = void 0;
    const node_child_process_1 = require("node:child_process");
    const execute = (command, args, options) => new Promise((resolve, reject) => {
        const child = (0, node_child_process_1.spawn)(command, args, options);
        child.on("exit", () => resolve("done"));
        child.on("close", (code) => {
            return code === 0 ? resolve("done") : reject("failed");
        });
    });
    exports.execute = execute;
});
