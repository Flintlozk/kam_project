import gql from 'graphql-tag';

export const MenuPageTypeDefs = gql`
  "Menu Page Schema"
  type MenuPageModel {
    pageID: Int
    html: String
  }

  extend type Query {
    getMenuPage: [MenuPageModel]
  }
`;
