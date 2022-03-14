import gql from 'graphql-tag';

export const TagsTypeDefs = gql`
  "Tags Schema"
  type TagsModel {
    pageID: Int
    tags: [String]
  }

  extend type Query {
    getTags: [String]
  }
`;
