/**
 * SEAL server details
 */
// export const SEAL_DOMAIN: string = "https://api.gluestack.io";
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
    exports.BOX_SERVER_URL = void 0;
    /**
     * SEAL GQL service details
     */
    // export const SEAL_GQL: string = "https://api.gluestack.io/backend/graphql";
    exports.BOX_SERVER_URL = "http://localhost:8000/api";
});
