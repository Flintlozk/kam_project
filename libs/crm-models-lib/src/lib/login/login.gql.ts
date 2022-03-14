import gql from 'graphql-tag';

export const LoginTypeDefs = gql`
  extend type Query {
    verifyAuth: HTTPResult
  }
`;
