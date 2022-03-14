import gql from 'graphql-tag';

export interface AddressData {
  province: string;
  amphoe: string;
  district: string;
  post_code: string;
}

export const AddressDataTypeDefs = gql`
  "Address Schema"
  type AddressDataModel {
    province: String
    amphoe: String
    district: String
    post_code: String
  }

  extend type Query {
    getAddressData(field: String, search: String): [AddressDataModel]
  }
`;
