import gql from 'graphql-tag';

export const CREATE_MENU_PAGE = gql`
  mutation createMenuPage($level: Int, $page: PageMenuInput, $menuGroupId: String) {
    createMenuPage(level: $level, page: $page, menuGroupId: $menuGroupId) {
      _id
      parentID
      orderNumber
      masterPageID
      name
      isHide
      isHomepage
    }
  }
`;

export const UPDATE_MENU_PAGE_DETAILS = gql`
  mutation updateMenuPageDetails($_id: String, $pageDetails: PageDetailsMenuInput, $menuGroupId: String) {
    updateMenuPageDetails(_id: $_id, pageDetails: $pageDetails, menuGroupId: $menuGroupId) {
      status
      value
    }
  }
`;

export const UPDATE_MENU_PAGE_HOMEPAGE = gql`
  mutation updateMenuPageHomepage($updateMenuPageHomePage: UpdateMenuPageHomePageMenuInput, $menuGroupId: String) {
    updateMenuPageHomepage(updateMenuPageHomePage: $updateMenuPageHomePage, menuGroupId: $menuGroupId) {
      status
      value
    }
  }
`;

export const UPDATE_MENU_PAGE_NAME = gql`
  mutation updateMenuPageName($name: String, $level: Int, $_id: String, $menuGroupId: String) {
    updateMenuPageName(name: $name, level: $level, _id: $_id, menuGroupId: $menuGroupId) {
      status
      value
    }
  }
`;

export const UPDATE_MENU_PAGE_HIDE = gql`
  mutation updateMenuPagesHide($updateMenuPagesHide: [UpdateMenuPagesHideMenuInput], $isHide: Boolean, $menuGroupId: String) {
    updateMenuPagesHide(updateMenuPagesHide: $updateMenuPagesHide, isHide: $isHide, menuGroupId: $menuGroupId) {
      status
      value
    }
  }
`;

export const UPDATE_MENU_PAGE_ORDER_NUMBERS = gql`
  mutation updateMenuPageOrderNumbers($menuPageOrderNumbers: [MenuPageOrderNumberMenuInput], $menuGroupId: String) {
    updateMenuPageOrderNumbers(menuPageOrderNumbers: $menuPageOrderNumbers, menuGroupId: $menuGroupId) {
      status
      value
    }
  }
`;

export const UPDATE_MENU_PAGE_FROM_TO_CONTAINER = gql`
  mutation updateMenuPageFromToContainer(
    $previousMenuPagePositions: [MenuPageFromToContainerMenuInput]
    $nextMenuPagePositions: [MenuPageFromToContainerMenuInput]
    $oldMenuPageOrderNumbers: [MenuPageOrderNumberMenuInput]
    $newMenuPageOrderNumbers: [MenuPageOrderNumberMenuInput]
    $menuGroupId: String
  ) {
    updateMenuPageFromToContainer(
      previousMenuPagePositions: $previousMenuPagePositions
      nextMenuPagePositions: $nextMenuPagePositions
      oldMenuPageOrderNumbers: $oldMenuPageOrderNumbers
      newMenuPageOrderNumbers: $newMenuPageOrderNumbers
      menuGroupId: $menuGroupId
    ) {
      status
      value
    }
  }
`;

export const REMOVE_MENU_PAGE_FROM_CONTAINER = gql`
  mutation removeMenuPageFromContainer($menuPagePositions: [MenuPageFromToContainerMenuInput], $menuPageOrderNumbers: [MenuPageOrderNumberMenuInput], $menuGroupId: String) {
    removeMenuPageFromContainer(menuPagePositions: $menuPagePositions, menuPageOrderNumbers: $menuPageOrderNumbers, menuGroupId: $menuGroupId) {
      status
      value
    }
  }
`;

export const GET_MENU_PAGE_BY_MENU_PAGE_ID = gql`
  query getMenuPageByMenuPageID($_id: String, $menuGroupId: String) {
    getMenuPageByMenuPageID(_id: $_id, menuGroupId: $menuGroupId) {
      _id
      parentID
      orderNumber
      masterPageID
      name
      isHide
      isHomepage
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
            ... on MegaOptionTextImageMenuModel {
              image
              imagePosition
              linkType
              linkParent
              linkUrl
              isTopTitle
              isHTML
              textImage
            }
            ... on MegaOptionCustomMenuModel {
              isHTML
              custom
            }
          }
          footerOption {
            ... on MegaOptionFooterTextImageMenuModel {
              isFooterHTML
              textImage
            }
            ... on MegaOptionFooterCustomMenuModel {
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
          ... on MegaConfigTextImageMenuModel {
            topTitle
            description
            html
            textImage
          }
          ... on MegaConfigCustomMenuModel {
            html
            custom
          }
        }
        footerMega {
          ... on MegaFooterConfigTextImageMenuModel {
            html
            textImage
          }
          ... on MegaFooterConfigCustomMenuModel {
            html
            custom
          }
        }
      }
    }
  }
`;

export const GET_PAGES_BY_PAGE_ID = gql`
  query getMenuPagesByPageID($menuGroupId: String) {
    getMenuPagesByPageID(menuGroupId: $menuGroupId) {
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
      }
    }
  }
`;

export const GET_MENU_GROUP = gql`
  query getMenuGroup {
    getMenuGroup {
      _id
      name
      html
    }
  }
`;
