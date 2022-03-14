import gql from 'graphql-tag';

export const PagesCreatedTypeDefs = gql`
  type PageCreatedResponse {
    created_at: String
  }

  extend type Query {
    getDateOfPageCreation: PageCreatedResponse
  }
`;
