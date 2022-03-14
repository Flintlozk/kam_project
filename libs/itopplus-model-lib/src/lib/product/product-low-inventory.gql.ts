import { gql } from 'graphql-tag';

export const ProductLowInventoryTypeDefs = gql`
  type IProductImages {
    id: String
    selfLink: String
    mediaLink: String
    bucket: String
  }

  type DetailsubProductLowInventory {
    subIsLower: Boolean
    subImages: [IProductImages]
    subNameProductVariant: String
    subInventory: Int
    subUnit_price: Float
    subWithhold: Int
    subUnpaid: Float
    subRevenue: Float
  }

  type IProductLowInventoryList {
    id: Int
    name: String
    createdAt: Date
    images: [IProductImages]
    subProductLowInventory: [DetailsubProductLowInventory]
    variants: Int
    isLower: Boolean
    inventory: Int
    withhold: Int
    unpaid: Int
    revenue: Int
    totalrows: Int
    status: Boolean
    idIndex: Int
  }

  type IProductLowStockTotal {
    sumLowStock: Int
  }

  extend type Query {
    getProductsLowInventory(filters: TableFilterInput): [IProductLowInventoryList]
    getProductLowStockTotal: [IProductLowStockTotal]
  }
`;
