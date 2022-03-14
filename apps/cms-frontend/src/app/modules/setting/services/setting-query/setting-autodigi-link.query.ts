import gql from 'graphql-tag';

export const GENERATE_AUTODIGI_LINK = gql`
  query generateAutodigiLink {
    generateAutodigiLink {
      linkKey
      linkStatus
    }
  }
`;

export const GET_LINKED_AUTODIGI_WEBSITES = gql`
  query getLinkedAutodigiWebsites {
    getLinkedAutodigiWebsites {
      websites {
        websiteID
        websiteName
        linkStatus
      }
    }
  }
`;
export const CHECK_SUBSCRIPTION_LINK_STATUS = gql`
  query checkSubscriptionLinkStatus {
    checkSubscriptionLinkStatus {
      isLink
      websites {
        websiteID
        websiteName
        linkStatus
        isPrimary
      }
    }
  }
`;

export const UPDATE_LINK_WEBSITE_AUTODIGI = gql`
  mutation updateLinkWebsiteAutodigi($params: UpdateLinkWebsiteAutodigiInput) {
    updateLinkWebsiteAutodigi(params: $params) {
      status
      value
    }
  }
`;

export const SET_PRIMARY_AUTODIGI_LINK = gql`
  mutation setPrimaryAutodigiLink($websiteID: String) {
    setPrimaryAutodigiLink(websiteID: $websiteID) {
      status
      value
    }
  }
`;
export const DO_UNLINK_AUTODIGI = gql`
  mutation doUnlinkAutodigi {
    doUnlinkAutodigi {
      status
      value
    }
  }
`;
