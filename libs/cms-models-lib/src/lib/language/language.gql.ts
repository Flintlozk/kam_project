import gql from 'graphql-tag';

export const LanguageTypeDefs = gql`
  "Language Schema"
  type LanguageModel {
    _id: String
    name: String
    localName: String
    icon: String
    cultureUI: String
  }

  extend type Query {
    getLanguages: [LanguageModel]
  }
`;
