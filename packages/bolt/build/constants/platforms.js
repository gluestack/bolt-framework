// readonly variable
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.supportedServiceRunners = exports.hostServiceRunners = void 0;
    exports.hostServiceRunners = ["docker", "local"];
    exports.supportedServiceRunners = [
        "local",
        "docker",
        "vmlocal",
        "vmdocker",
    ];
});
