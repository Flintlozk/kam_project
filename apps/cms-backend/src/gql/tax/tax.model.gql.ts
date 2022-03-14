import gql from 'graphql-tag';

export const TaxTypeDefs = gql`
  "Tax Schema"
  type TaxResponse {
    id: Int
    tax_id: String
    name: String
    tax: Float
    status: Boolean
  }

  extend type Query {
    getTaxByPageID: TaxResponse
  }
`;
