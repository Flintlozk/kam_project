import gql from 'graphql-tag';
export const CHANGING_PAGE = gql`
  query changingPage($pageIndex: Int) {
    changingPage(pageIndex: $pageIndex) {
      id
      fb_page_id
      page_name
      page_username
      created_at
      updated_at
    }
  }
`;

export const CHECK_PAGE_FACEBOOK_CONNECTED = gql`
  query checkPageFacebookConnected($pageIndex: Int) {
    checkPageFacebookConnected(pageIndex: $pageIndex) {
      isConnected
    }
  }
`;
export const GET_USER_CONTEXT = gql`
  query getUserContext($subscriptionIndex: Int) {
    getUserContext(subscriptionIndex: $subscriptionIndex) {
      id
      name
      profile_img
      pages {
        pageIndex
        pageId
        pageName
        pageRole
        picture
        wizardStep
        pageAppScope
        pageSettings {
          page_id
          status
          setting_type
          options
        }
      }
    }
  }
`;
