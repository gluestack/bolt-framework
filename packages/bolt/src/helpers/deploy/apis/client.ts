import { GraphQLClient } from "graphql-request";
import { BOX_SERVER_URL } from "../../../config";

export const clientGQL = new GraphQLClient(BOX_SERVER_URL);

export { request, gql } from "graphql-request";
