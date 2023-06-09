"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployment = void 0;
const client_1 = require("../../client");
const deployment = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, client_1.gql) `
    query db_deployments_by_pk($id: Int!) {
      db_deployments_by_pk(id: $id) {
        infra_json
      }
    }
  `;
    const variables = {
        id
    };
    const requestHeaders = {
        'Authorization': `Bearer ${token}`
    };
    return client_1.clientGQL.request(query, variables, requestHeaders);
});
exports.deployment = deployment;
