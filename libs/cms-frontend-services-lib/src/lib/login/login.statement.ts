import gql from 'graphql-tag';

export const LOGIN_BY_EMAIL = gql`
  query loginByEmail($query: ILogin) {
    loginByEmail(query: $query) {
      status
    }
  }
`;

export const LOGIN_FACEBOOK = gql`
  mutation facebookLoginAuth($credential: FacebookCredentialInput) {
    facebookLoginAuth(credential: $credential) {
      status
      value
    }
  }
`;

export const LOGIN_GOOGLE = gql`
  mutation googleLoginAuth($credential: IGoogleCredentialInput) {
    googleLoginAuth(credential: $credential) {
      status
      value
    }
  }
`;
