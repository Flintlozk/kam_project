import gql from 'graphql-tag';

export const AutodigiSubscriptionTypeDefs = gql`
  type AutodigiWebsiteList {
    websiteID: String
    websiteName: String
    linkStatus: Boolean
    isPrimary: Boolean
  }

  type CheckSubscriptionLinkResponse {
    isLink: Boolean
    websites: [AutodigiWebsiteList]
  }

  type LinkedAutodigiWebsiteList {
    websiteID: String
    websiteName: String
  }
  type LinkedAutodigiWebsites {
    websites: [LinkedAutodigiWebsiteList]
  }

  ### QUERY/QUERY/QUERY/QUERY/QUERY/QUERY/QUERY/QUERY/QUERY/QUERY/QUERY/
  extend type Query {
    loginToAutodigi: HTTPResult
    loginToMoreCommerce: HTTPResult
    checkSubscriptionLinkStatus: CheckSubscriptionLinkResponse
    getLinkedAutodigiWebsites: LinkedAutodigiWebsites
  }

  input UpdateLinkWebsiteAutodigiInput {
    link: [String]
    unlink: [String]
  }

  ### MUTATION/MUTATION/MUTATION/MUTATION/MUTATION/MUTATION/MUTATION/
  extend type Mutation {
    updateLinkWebsiteAutodigi(params: UpdateLinkWebsiteAutodigiInput): HTTPResult
    setPrimaryAutodigiLink(websiteID: String): HTTPResult
    doUnlinkAutodigi: HTTPResult
  }
`;
