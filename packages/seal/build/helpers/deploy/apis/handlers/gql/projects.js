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
        define(["require", "exports", "../../client"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.projects = void 0;
    const client_1 = require("../../client");
    const projects = (teamId, token) => __awaiter(void 0, void 0, void 0, function* () {
        const query = (0, client_1.gql) `
    query projects ($teamId: Int!) {
      projects(where: {team_id: {_eq: $teamId}}) {
        project_hash
        name
      }
    }
  `;
        const variables = {
            teamId
        };
        const requestHeaders = {
            'Authorization': `Bearer ${token}`
        };
        return client_1.clientGQL.request(query, variables, requestHeaders);
    });
    exports.projects = projects;
});
