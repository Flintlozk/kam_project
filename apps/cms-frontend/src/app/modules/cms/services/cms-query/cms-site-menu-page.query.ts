import gql from 'graphql-tag';

export const CREATE_WEB_PAGE = gql`
  mutation createWebPage($level: Int, $page: PageInput) {
    createWebPage(level: $level, page: $page) {
      _id
      parentID
      orderNumber
      masterPageID
      name
      isHide
      isHomepage
      isChildSelected
    }
  }
`;

export const UPDATE_WEB_PAGE_DETAILS = gql`
  mutation updateWebPageDetails($_id: String, $pageDetails: PageDetailsInput) {
    updateWebPageDetails(_id: $_id, pageDetails: $pageDetails) {
      status
      value
    }
  }
`;

export const UPDATE_WEB_PAGE_HIDE = gql`
  mutation updateWebPagesHide($updateWebPagesHide: [UpdateWebPagesHideInput], $isHide: Boolean) {
    updateWebPagesHide(updateWebPagesHide: $updateWebPagesHide, isHide: $isHide) {
      status
      value
    }
  }
`;

export const UPDATE_WEB_PAGE_NAME = gql`
  mutation updateWebPageName($name: String, $level: Int, $_id: String) {
    updateWebPageName(name: $name, level: $level, _id: $_id) {
      status
      value
    }
  }
`;

export const UPDATE_WEB_PAGE_HOMEPAGE = gql`
  mutation updateWebPageHomepage($updateWebPageHomePage: UpdateWebPageHomePageInput) {
    updateWebPageHomepage(updateWebPageHomePage: $updateWebPageHomePage) {
      status
      value
    }
  }
`;

export const REMOVE_WEB_PAGE_FROM_CONTAINER = gql`
  mutation removeWebPageFromContainer($webPagePositions: [WebPageFromToContainerInput], $webPageOrderNumbers: [WebPageOrderNumberInput]) {
    removeWebPageFromContainer(webPagePositions: $webPagePositions, webPageOrderNumbers: $webPageOrderNumbers) {
      status
      value
    }
  }
`;

export const UPDATE_WEB_PAGE_ORDER_NUMBERS = gql`
  mutation updateWebPageOrderNumbers($webPageOrderNumbers: [WebPageOrderNumberInput]) {
    updateWebPageOrderNumbers(webPageOrderNumbers: $webPageOrderNumbers) {
      status
      value
    }
  }
`;

export const UPDATE_WEB_PAGE_FROM_TO_CONTAINER = gql`
  mutation updateWebPageFromToContainer(
    $previousWebPagePositions: [WebPageFromToContainerInput]
    $nextWebPagePositions: [WebPageFromToContainerInput]
    $oldWebPageOrderNumbers: [WebPageOrderNumberInput]
    $newWebPageOrderNumbers: [WebPageOrderNumberInput]
  ) {
    updateWebPageFromToContainer(
      previousWebPagePositions: $previousWebPagePositions
      nextWebPagePositions: $nextWebPagePositions
      oldWebPageOrderNumbers: $oldWebPageOrderNumbers
      newWebPageOrderNumbers: $newWebPageOrderNumbers
    ) {
      status
      value
    }
  }
`;

export const GET_WEB_PAGE_BY_WEB_PAGE_ID = gql`
  query getWebPageByWebPageID($_id: String) {
    getWebPageByWebPageID(_id: $_id) {
      _id
      parentID
      orderNumber
      masterPageID
      name
      isHide
      isHomepage
      isChildSelected
      themeLayoutMode {
        useThemeLayoutMode
        themeLayoutIndex
      }
      setting {
        isOpenNewTab
        isMaintenancePage
        isIcon
        pageIcon
        isMega
        mega {
          primaryType
          footerType
          primaryOption {
            ... on MegaOptionTextImageModel {
              image
              imagePosition
              linkType
              linkParent
              linkUrl
              isTopTitle
              isHTML
              textImage
            }
            ... on MegaOptionCustomModel {
              isHTML
              custom
            }
          }
          footerOption {
            ... on MegaOptionFooterTextImageModel {
              isFooterHTML
              textImage
            }
            ... on MegaOptionFooterCustomModel {
              isFooterHTML
              custom
            }
          }
        }
        socialShare
      }
      permission {
        type
        option {
          password
          onlyPaidMember
        }
      }
      configs {
        cultureUI
        displayName
        seo {
          title
          shortUrl
          description
          keyword
        }
        primaryMega {
          ... on MegaConfigTextImageModel {
            topTitle
            description
            html
            textImage
          }
          ... on MegaConfigCustomModel {
            html
            custom
          }
        }
        footerMega {
          ... on MegaFooterConfigTextImageModel {
            html
            textImage
          }
          ... on MegaFooterConfigCustomModel {
            html
            custom
          }
        }
      }
    }
  }
`;

export const GET_PAGES_BY_PAGE_ID = gql`
  query getWebPagesByPageID {
    getWebPagesByPageID {
      _id
      level
      pages {
        _id
        parentID
        orderNumber
        masterPageID
        name
        isHide
        isHomepage
        isChildSelected
      }
    }
  }
`;

export const GET_MENU_HTML = gql`
  query getMenuHTML($menuHTML: MenuHTMLInput) {
    getMenuHTML(menuHTML: $menuHTML)
  }
`;

export const GET_MENU_CSS_JS = gql`
  query getMenuCssJs($webPageID: String, $_id: String, $isFromTheme: Boolean) {
    getMenuCssJs(webPageID: $webPageID, _id: $_id, isFromTheme: $isFromTheme) {
      css
      js
    }
  }
`;
export const GET_HOMEPAGE_ID = gql`
  query getHomePageId {
    getHomePageId {
      status
      value
    }
  }
`;

export const GET_LANDING_WEB_PAGE_BY_NAME = gql`
  query getLandingWebPageByName($previousWebPageID: String, $componentId: String) {
    getLandingWebPageByName(previousWebPageID: $previousWebPageID, componentId: $componentId) {
      _id
    }
  }
`;
