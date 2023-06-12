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
    exports.SEAL_GQL = exports.SEAL_DOMAIN = void 0;
    /**
     * SEAL server details
     */
    exports.SEAL_DOMAIN = 'https://api.gluestack.io';
    /**
     * SEAL GQL service details
     */
    exports.SEAL_GQL = 'https://api.gluestack.io/backend/graphql';
});
