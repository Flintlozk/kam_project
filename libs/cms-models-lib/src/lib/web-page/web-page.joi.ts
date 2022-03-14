import * as Joi from 'joi';

export const MenuHTMLRequest = {
  menuHTML: Joi.object({
    sourceType: Joi.string().required(),
    parentMenuId: Joi.string().allow('').allow(null),
    cultureUI: Joi.string().required(),
    menuGroupId: Joi.string().allow('').allow(null),
  }).required(),
};

export const MenuCssJsRequest = {
  webPageID: Joi.string().required(),
  _id: Joi.string().allow('').allow(null),
  tempId: Joi.string().allow('').allow(null),
  isFromTheme: Joi.boolean().required(),
};

export const WebPagePageIDRequest = {
  pageID: Joi.number().required(),
};
export const webPageThemelayoutIndexValidate = {
  webPageID: Joi.string().required(),
  themeLayoutIndex: Joi.number().required(),
};
export const WebPageResponse = {
  _id: Joi.string().required(),
  pageID: Joi.number().required(),
  level: Joi.number().required(),
  pages: Joi.array()
    .items({
      _id: Joi.string().required(),
      parentID: Joi.string().allow('').allow(null),
      orderNumber: Joi.number().required(),
      masterPageID: Joi.string().allow('').allow(null),
      name: Joi.string().required(),
      isHide: Joi.boolean().required(),
      isHomepage: Joi.boolean().required(),
    })
    .required(),
};

export const getLandingWebPageByNameRequest = {
  previousWebPageID: Joi.string().required(),
  componentId: Joi.string().required(),
};

export const WebPageIDRequest = {
  _id: Joi.string().required(),
};

export const WebPageDetailsRequest = {
  _id: Joi.string().required(),
  pageDetails: Joi.object({
    setting: Joi.object({
      isOpenNewTab: Joi.boolean().required(),
      isMaintenancePage: Joi.boolean().required(),
      isIcon: Joi.boolean().required(),
      pageIcon: Joi.string().allow('').allow(null),
      isMega: Joi.boolean().required(),
      mega: Joi.object({
        primaryType: Joi.string().required(),
        footerType: Joi.string().required(),
        primaryOption: Joi.string().required(),
        footerOption: Joi.string().required(),
      }).required(),
      socialShare: Joi.string().allow('').allow(null),
    }).required(),
    permission: Joi.object({
      type: Joi.string().allow('').allow(null),
      option: Joi.object({
        password: Joi.string().allow('').allow(null),
        onlyPaidMember: Joi.boolean().allow(null),
      }),
    }).required(),
    configs: Joi.array()
      .items({
        cultureUI: Joi.string().required(),
        displayName: Joi.string().allow('').allow(null),
        seo: Joi.object({
          title: Joi.string().allow('').allow(null),
          shortUrl: Joi.string().allow('').allow(null),
          description: Joi.string().allow('').allow(null),
          keyword: Joi.string().allow('').allow(null),
        }).required(),
        primaryMega: Joi.string().required(),
        footerMega: Joi.string().required(),
        mode: Joi.string().allow('').allow(null),
      })
      .required(),
  }).required(),
};

export const WebPageOrderNumberRequest = {
  webPageOrderNumbers: Joi.array().items({
    level: Joi.number().required(),
    _id: Joi.string().required(),
    orderNumber: Joi.number().required(),
  }),
};

export const WebPageNameRequest = {
  name: Joi.string().required(),
  level: Joi.number().required(),
  _id: Joi.string().required(),
};

export const WebPagesHideRequest = {
  updateWebPagesHide: Joi.array()
    .items({
      level: Joi.number().required(),
      _id: Joi.string().required(),
    })
    .required(),
  isHide: Joi.boolean().required(),
};

export const WebPageHomePageRequest = {
  updateWebPageHomePage: Joi.object({
    previousLevel: Joi.number().allow(null),
    previousId: Joi.string().allow('').allow(null),
    currentLevel: Joi.number().required(),
    currentId: Joi.string().required(),
  }).required(),
};

export const WebPageCreateRequest = {
  level: Joi.number().required(),
  page: Joi.object({
    parentID: Joi.string().allow('').allow(null),
    orderNumber: Joi.number().required(),
    masterPageID: Joi.string().allow('').allow(null),
    name: Joi.string().required(),
    isHide: Joi.boolean().required(),
    isHomepage: Joi.boolean().required(),
  }).required(),
};

export const WebPageLandingPageResponse = {
  _id: Joi.string().required(),
};

export const WebPagePageResponse = {
  _id: Joi.string().required(),
  parentID: Joi.string().allow('').allow(null),
  orderNumber: Joi.number().required(),
  masterPageID: Joi.string().allow('').allow(null),
  name: Joi.string().required(),
  isHide: Joi.boolean().required(),
  isHomepage: Joi.boolean().required(),
  themeLayoutMode: Joi.object({
    useThemeLayoutMode: Joi.boolean().required(),
    themeLayoutIndex: Joi.number().required(),
  }),
  setting: Joi.object({
    isOpenNewTab: Joi.boolean().required(),
    isMaintenancePage: Joi.boolean().required(),
    isIcon: Joi.boolean().required(),
    pageIcon: Joi.string().allow('').allow(null),
    isMega: Joi.boolean().required(),
    mega: Joi.object({
      primaryType: Joi.string().required(),
      footerType: Joi.string().required(),
      primaryOption: [
        {
          image: Joi.string().allow('').allow(null),
          imagePosition: Joi.string().required(),
          linkType: Joi.string().required(),
          linkParent: Joi.string().allow('').allow(null),
          linkUrl: Joi.string().allow('').allow(null),
          isTopTitle: Joi.boolean().required(),
          isHTML: Joi.boolean().required(),
          textImage: Joi.string().allow('').allow(null),
        },
        {
          isHTML: Joi.boolean().required(),
          custom: Joi.string().allow('').allow(null),
        },
      ],
      footerOption: [
        {
          isFooterHTML: Joi.boolean().required(),
          textImage: Joi.string().allow('').allow(null),
        },
        {
          isFooterHTML: Joi.boolean().required(),
          custom: Joi.string().allow('').allow(null),
        },
      ],
    }).required(),
    socialShare: Joi.string().allow('').allow(null),
  }).required(),
  permission: Joi.object({
    type: Joi.string().allow('').allow(null),
    option: Joi.object({
      password: Joi.string().allow('').allow(null),
      onlyPaidMember: Joi.boolean().allow(null),
    }),
  }).required(),
  configs: Joi.array()
    .items({
      cultureUI: Joi.string().required(),
      displayName: Joi.string().allow('').allow(null),
      seo: Joi.object({
        title: Joi.string().allow('').allow(null),
        shortUrl: Joi.string().allow('').allow(null),
        description: Joi.string().allow('').allow(null),
        keyword: Joi.string().allow('').allow(null),
      }).required(),
      primaryMega: [
        {
          topTitle: Joi.string().allow('').allow(null),
          description: Joi.string().allow('').allow(null),
          html: Joi.string().allow('').allow(null),
          textImage: Joi.string().allow('').allow(null),
        },
        {
          html: Joi.string().allow('').allow(null),
          custom: Joi.string().allow('').allow(null),
        },
      ],
      footerMega: [
        {
          html: Joi.string().allow('').allow(null),
          textImage: Joi.string().allow('').allow(null),
        },
        {
          html: Joi.string().allow('').allow(null),
          custom: Joi.string().allow('').allow(null),
        },
      ],
      mode: Joi.string().allow('').allow(null),
    })
    .required(),
};

export const WebPageRemoveFromContainerRequest = {
  webPagePositions: Joi.array()
    .items({
      parentID: Joi.string().allow('').allow(null),
      level: Joi.number().required(),
      _id: Joi.string().required(),
    })
    .required(),
  webPageOrderNumbers: Joi.array()
    .items({
      level: Joi.number().required(),
      _id: Joi.string().required(),
      orderNumber: Joi.number().required(),
    })
    .required(),
};

export const WebPageUpdateFromToContainerRequest = {
  previousWebPagePositions: Joi.array()
    .items({
      parentID: Joi.string().allow('').allow(null),
      level: Joi.number().required(),
      _id: Joi.string().required(),
    })
    .required(),
  nextWebPagePositions: Joi.array()
    .items({
      parentID: Joi.string().allow('').allow(null),
      level: Joi.number().required(),
      _id: Joi.string().required(),
    })
    .required(),
  oldWebPageOrderNumbers: Joi.array()
    .items({
      level: Joi.number().required(),
      _id: Joi.string().required(),
      orderNumber: Joi.number().required(),
    })
    .required(),
  newWebPageOrderNumbers: Joi.array()
    .items({
      level: Joi.number().required(),
      _id: Joi.string().required(),
      orderNumber: Joi.number().required(),
    })
    .required(),
};
