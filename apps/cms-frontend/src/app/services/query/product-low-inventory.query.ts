import { gql } from 'graphql-tag';

export const GET_PRODUCT_LOW_INVENTORY = gql`
  query getProductsLowInventory($filters: TableFilterInput) {
    getProductsLowInventory(filters: $filters) {
      id
      name
      createdAt
      images {
        mediaLink
      }
      subProductLowInventory {
        subIsLower
        subImages {
          mediaLink
        }
        subNameProductVariant
        subInventory
        subUnit_price
        subWithhold
        subUnpaid
        subRevenue
      }
      variants
      isLower
      inventory
      withhold
      unpaid
      revenue
      totalrows
      status
      idIndex
    }
  }
`;

export const GET_PRODUCT_LOW_STOCK = gql`
query getProductLowStockTotal {
  getProductLowStockTotal {
    sumLowStock
  }
}
`;
