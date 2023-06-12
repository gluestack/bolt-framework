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
    exports.removeSpecialCharacters = void 0;
    const removeSpecialCharacters = (str) => {
        const regex = /[^a-zA-Z0-9 ]/g;
        str = str.replace(regex, "");
        return str;
    };
    exports.removeSpecialCharacters = removeSpecialCharacters;
});
