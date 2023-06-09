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
exports.createDeployment = void 0;
const client_1 = require("../../client");
const createDeployment = (projectName, projectHash, teamID, token, fileID) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, client_1.gql) `
    mutation ($projectName: String!, $projectHash: String!, $teamID: Int!, $token: String!, $fileID: Int!) {
      createdbdeployment(input: {
        project_name: $projectName,
        project_hash: $projectHash,
        team_id : $teamID,
        access_token: $token
        file_id: $fileID
      }) {
        success
        data {
          deployment_id
          project_hash
        }
        message
      }
    }
  `;
    const variables = {
        projectName,
        projectHash,
        teamID,
        token,
        fileID
    };
    const requestHeaders = {};
    return client_1.clientGQL.request(query, variables, requestHeaders);
});
exports.createDeployment = createDeployment;
