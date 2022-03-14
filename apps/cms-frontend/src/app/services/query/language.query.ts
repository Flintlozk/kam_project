import gql from 'graphql-tag';

export const GET_LANGUAGES = gql`
  query getLanguages {
    getLanguages {
      _id
      name
      localName
      icon
      cultureUI
    }
  }
`;
