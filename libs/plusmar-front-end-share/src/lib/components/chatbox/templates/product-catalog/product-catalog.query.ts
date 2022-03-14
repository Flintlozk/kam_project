import gql from 'graphql-tag';

export const SEND_PRODUCT_CATALOG_TO_CHATBOX = gql`
  mutation sendProductCatalogToChatBox($catalogID: Int, $audienceID: Int, $PSID: String) {
    sendProductCatalogToChatBox(catalogID: $catalogID, audienceID: $audienceID, PSID: $PSID) {
      status
      value
    }
  }
`;
