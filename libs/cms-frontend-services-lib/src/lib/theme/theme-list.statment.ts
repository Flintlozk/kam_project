import gql from 'graphql-tag';

export const GET_TOTAL_THEME_NUMBER = gql`
  query getTotalThemeNumber {
    getTotalThemeNumber
  }
`;

export const GET_THEMES_BY_LIMIT = gql`
  query getThemesByLimit($skip: Int, $limit: Int) {
    getThemesByLimit(skip: $skip, limit: $limit) {
      _id
      html {
        thumbnail {
          path
        }
      }
      name
    }
  }
`;

export const GET_THEME_GENERAL_INFO = gql`
  query getTheme {
    getTheme {
      _id
      html {
        thumbnail {
          path
        }
      }
      name
    }
  }
`;
