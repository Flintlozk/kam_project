import gql from 'graphql-tag';
export const PublishTypeDefs = gql`
  "Publish Schema"
  type publish {
    _id: String
  }

  extend type Query {
    publishAllPages: HTTPResult
  }
`;
