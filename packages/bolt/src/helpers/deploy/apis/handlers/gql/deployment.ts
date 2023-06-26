import { clientGQL, gql } from '../../client';

export const deployment = async (id: number, token: string) => {
  const query = gql`
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

  return clientGQL.request(query, variables, requestHeaders);
};
