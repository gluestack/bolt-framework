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
    const regex = /\{\{([^}]+)\}\}/g;
    class Placeholder {
        static replace(originalString, replaceValue) {
            return originalString.replace(regex, replaceValue);
        }
        static capitailize(originalString) {
            return originalString.replace(regex, (match, captureGroup) => {
                return captureGroup.toUpperCase();
            });
        }
    }
    exports.default = Placeholder;
});
