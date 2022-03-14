import gql from 'graphql-tag';

export const AutodigiLinkTypeDefs = gql`
  type getTeamConfig {
    teamname: String
    source: String
    destination: String
    required: String
  }

  type AutodigiLinkKey {
    linkKey: String
    linkStatus: Boolean
  }

  type TestReturnOutsideCall {
    context: String
  }

  type LinkAutodigiSubscriptionResponse {
    status: Int
    message: String
  }

  extend type Query {
    generateAutodigiLink: AutodigiLinkKey
    """
    Autodigi Call Endpoint
    """
    testCallFromOutside: TestReturnOutsideCall
    linkAutodigiSubscription(userID: String, hash: String): LinkAutodigiSubscriptionResponse
  }
`;
