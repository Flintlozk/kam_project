import gql from 'graphql-tag';

export const GET_PRODUCTS_FROM_LAZADA = gql`
  query getProductsFromLazada {
    getProductsFromLazada {
      status
      value
    }
  }
`;

export const GET_PRODUCTS_FROM_SHOPEE = gql`
  query getProductsFromShopee {
    getProductsFromShopee {
      status
      value
    }
  }
`;

export const GET_PRODUCT_MARKETPLACE_IMPORT_LIST = gql`
  query getProductMarketPlaceList($isImported: Boolean, $filters: TableFilterInput) {
    getProductMarketPlaceList(isImported: $isImported, filters: $filters) {
      id
      marketPlaceID
      name
      price
      variants
      marketPlaceType
      active
      inventory
      totalRows
    }
  }
`;

export const IMPORT_DELETE_PRODUCT_FROM_MARKETPLACE = gql`
  mutation importDeleteProductFromMarketPlace($ids: [Int], $operation: String) {
    importDeleteProductFromMarketPlace(ids: $ids, operation: $operation) {
      status
      value
    }
  }
`;

export const PUBLISH_PRODUCT_ON_LAZADA = gql`
  mutation publishProductOnLazada($payloadParams: publishProductOnLazadaInput) {
    publishProductOnLazada(payloadParams: $payloadParams) {
      status
      value
    }
  }
`;

export const PUBLISH_PRODUCT_ON_SHOPEE = gql`
  mutation publishProductOnShopee($payloadParams: PublishProductOnShopeeInput) {
    publishProductOnShopee(payloadParams: $payloadParams) {
      status
      value
    }
  }
`;

export const UPDATE_PRODUCT_ON_MARKETPLACES = gql`
  mutation updateProductOnMarketPlaces($id: Int, $marketPlaceUpdateTypes: [String]) {
    updateProductOnMarketPlaces(id: $id, marketPlaceUpdateTypes: $marketPlaceUpdateTypes) {
      status
      value
    }
  }
`;

export const PUBLISH_VARIANT_TO_SHOPEE_PRODUCT = gql`
  mutation publishVariantToShopeeProduct($productID: String, $variantIDs: [Int]) {
    publishVariantToShopeeProduct(productID: $productID, variantIDs: $variantIDs) {
      status
      value
    }
  }
`;

export const GET_PRODUCT_MARKET_PLACE_VARIANT_LIST = gql`
  query getProductMarketPlaceVariantList($id: Int, $isMerged: Boolean) {
    getProductMarketPlaceVariantList(id: $id, isMerged: $isMerged) {
      id
      productMarketPlaceID
      name
      unitPrice
      inventory
      marketPlaceType
      active
    }
  }
`;

export const GET_LAZADA_SUGGESTED_CATEGORIES = gql`
  query getLazadaSuggestedCategories($keywords: [String]) {
    getLazadaSuggestedCategories(keywords: $keywords) {
      categoryPath
      categoryName
      categoryId
    }
  }
`;

export const GET_PRODUCT_MARKET_PLACE_CATEGORY_TREE = gql`
  query getProductMarketPlaceCategoryTree($marketPlaceType: String, $parentOrCategoryID: Int, $isCategory: Boolean, $language: String) {
    getProductMarketPlaceCategoryTree(marketPlaceType: $marketPlaceType, parentOrCategoryID: $parentOrCategoryID, isCategory: $isCategory, language: $language) {
      id
      marketplaceType
      categoryID
      parentID
      name
      leaf
      language
    }
  }
`;

export const GET_MARKETPLACE_BRAND_SUGGESTIONS = gql`
  query getMarketPlaceBrandSuggestions($keyword: String, $socialType: String, $isSuggestion: Boolean) {
    getMarketPlaceBrandSuggestions(keyword: $keyword, socialType: $socialType, isSuggestion: $isSuggestion) {
      name
    }
  }
`;

export const GET_LAZADA_CATEGORY_ATTRIBUTE = gql`
  query getLazadaCategoryAttribute($id: Int, $marketPlaceType: String, $lang: String) {
    getLazadaCategoryAttribute(id: $id, marketPlaceType: $marketPlaceType, lang: $lang) {
      name
      input_type
      options {
        name
      }
      is_mandatory
      attribute_type
      is_sale_prop
      label
    }
  }
`;

export const GET_SHOPEE_BRANDS = gql`
  query getShopeeBrands($id: Int) {
    getShopeeBrands(id: $id) {
      brandList {
        brand_id
        original_brand_name
        display_brand_name
      }
      isMandatory
    }
  }
`;

export const GET_SHOPEE_CATEGORY_ATTRIBUTE = gql`
  query getShopeeCategoryAttribute($id: Int, $marketPlaceType: String, $lang: String) {
    getShopeeCategoryAttribute(id: $id, marketPlaceType: $marketPlaceType, lang: $lang) {
      attribute_id
      original_attribute_name
      display_attribute_name
      is_mandatory
      input_validation_type
      format_type
      date_format_type
      input_type
      attribute_unit
      attribute_value_list {
        value_id
        original_value_name
        display_value_name
        value_unit
        parent_attribute_list {
          parent_attribute_id
          parent_value_id
        }
        parent_brand_list {
          parent_brand_id
        }
      }
    }
  }
`;

export const GET_SHOPEE_LOGISTICS = gql`
  query getShopeeLogistics {
    getShopeeLogistics {
      text
    }
  }
`;

export const MERGE_MARKET_PLACE_PRODUCT_OR_VARIANT = gql`
  mutation mergeMarketPlaceProductOrVariant($id: Int, $marketIDs: [Int], $mergeType: String) {
    mergeMarketPlaceProductOrVariant(id: $id, marketIDs: $marketIDs, mergeType: $mergeType) {
      status
      value
      expiresAt
    }
  }
`;

export const UNMERGE_MARKET_PLACE_PRODUCT_OR_VARIANT = gql`
  mutation unMergeMarketPlaceProductOrVariant($unMergeItem: [MergedMarketPlaceItemInput], $unMergeType: String) {
    unMergeMarketPlaceProductOrVariant(unMergeItem: $unMergeItem, unMergeType: $unMergeType) {
      status
      value
    }
  }
`;
