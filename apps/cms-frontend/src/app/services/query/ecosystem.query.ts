import gql from 'graphql-tag';

export const LOGIN_TO_AUTODIGI = gql`
  query loginToAutodigi {
    loginToAutodigi {
      status
      value
    }
  }
`;
export const LOGIN_TO_MORE_COMMERCE = gql`
  query loginToMoreCommerce {
    loginToMoreCommerce {
      status
      value
    }
  }
`;
