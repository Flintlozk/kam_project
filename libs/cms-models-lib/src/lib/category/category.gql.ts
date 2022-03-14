import gql from 'graphql-tag';

export const CategoryTypeDefs = gql`
  "Category Schema"
  type CategoryModelWithLength {
    categories: [CategoryModel]
    total_rows: Int
  }
  type CategoryModel {
    _id: String
    pageID: Int
    name: String
    language: [CategoryCultureModel]
    featuredImg: String
    parentId: String
    subCategories: [CategoryModel]
  }

  type CategoryCultureModel {
    cultureUI: String
    name: String
    slug: String
    description: String
  }
  input ContentCategoryCultureInput {
    cultureUI: String
    name: String
    slug: String
    description: String
  }
  input ContentCategoryInput {
    _id: String
    pageID: Int
    name: String
    featuredImg: String
    language: [ContentCategoryCultureInput]
    parentId: String
    status: Boolean
  }
  input InputTableFilter {
    search: String
    pageSize: Int
    currentPage: Int
    orderBy: [String]
    orderMethod: String
  }
  extend type Query {
    getAllCategories(tableFilter: InputTableFilter): CategoryModelWithLength
    getCategoriesByIds(_ids: [String]): [CategoryModel]
    checkCategoryNameExist(name: String, id: String): HTTPResult
  }
  extend type Mutation {
    addContentCategory(categoryData: ContentCategoryInput): HTTPResult
    updateCategoryNameByID(categoryData: ContentCategoryInput): HTTPResult
    deleteCategoryByID(id: String): HTTPResult
    deleteCategoriesByID(ids: [String]): HTTPResult
  }
`;
