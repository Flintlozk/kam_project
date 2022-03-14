import gql from 'graphql-tag';

export const PDPATypeDefs = gql`
  input InputSetPDPA {
    textENG: String
    textTH: String
  }

  extend type Mutation {
    setTermsAndCondition(input: InputSetPDPA): Boolean
    setPrivacyPolicy(input: InputSetPDPA): Boolean
  }
`;
