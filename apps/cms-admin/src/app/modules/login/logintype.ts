import gql from 'graphql-tag';

export const LOGIN_FACEBOOK = gql`
  mutation facebookLoginAuth($credential: FacebookCredentialInput) {
    facebookLoginAuth(credential: $credential) {
      status
      value
    }
  }
`;
