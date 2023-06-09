import { GraphQLClient } from 'graphql-request';
import { SEAL_GQL } from '../../../config';

export const clientGQL = new GraphQLClient(SEAL_GQL);


export { request, gql } from 'graphql-request';
