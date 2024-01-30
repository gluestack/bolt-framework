(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "graphql-request", "../../../config", "graphql-request"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.gql = exports.request = exports.clientGQL = void 0;
    const graphql_request_1 = require("graphql-request");
    const config_1 = require("../../../config");
    exports.clientGQL = new graphql_request_1.GraphQLClient(config_1.BOX_SERVER_URL);
    var graphql_request_2 = require("graphql-request");
    Object.defineProperty(exports, "request", { enumerable: true, get: function () { return graphql_request_2.request; } });
    Object.defineProperty(exports, "gql", { enumerable: true, get: function () { return graphql_request_2.gql; } });
});
