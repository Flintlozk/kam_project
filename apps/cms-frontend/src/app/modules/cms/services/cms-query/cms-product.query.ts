import { gql } from 'graphql-tag';

export const GET_PRODUCT_ALL_LIST = gql`
  query getProductAllList($filters: TableFilterInput) {
    getProductAllList(filters: $filters) {
      id
      name
      desc
      sku
      status
      statusValue
      sold
      inventory
      reserved
      maxUnitPrice
      minUnitPrice
      variants
      ref
      images {
        mediaLink
      }
      totalrows
      active
      marketPlaceType
      marketPlaceID
      marketPlaceProductID
      mergedProductData {
        mergedMarketPlaceID
        mergedMarketPlaceType
        mergedVariants {
          marketPlaceVariantID
          marketPlaceVariantType
          marketPlaceVariantSku
        }
      }
      isMerged
    }
  }
`;
