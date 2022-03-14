import gql from 'graphql-tag';

export const DevTypeDefs = gql`
  extend type Query {
    devRequest0: String
    devRequest1: String
    devRequest2: String
    devRequest3(value: String): String
  }
`;
