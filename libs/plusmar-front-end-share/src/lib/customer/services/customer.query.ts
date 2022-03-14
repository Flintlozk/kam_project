import gql from 'graphql-tag';

export const UPDATE_CUSTOMER_MUTATION = gql`
  mutation updateCustomer($ID: String, $fields: CustomerModelInput) {
    updateCustomer(ID: $ID, fields: $fields) {
      _id
      name
      email
      Facebook {
        ASID
        PSID
        pageID
        picture
        accessToken
        pageAccessToken
      }
    }
  }
`;
