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
    exports.typeOf = void 0;
    /**
     * typeOf returns the type of the value passed in.
     *
     * @param value any
     * @returns string
     */
    const typeOf = (value) => {
        return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
    };
    exports.typeOf = typeOf;
});
