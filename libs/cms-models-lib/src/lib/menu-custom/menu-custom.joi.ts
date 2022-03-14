import * as Joi from 'joi';

export const MenuPagePageIDRequest = {
  pageID: Joi.number().required(),
};

export const MenuPageGroupIDRequest = {
  menuGroupId: Joi.string().required(),
};

export const MenuGroupResponse = {
  _id: Joi.string().required(),
  name: Joi.string().required(),
};

export const MenuPageResponse = {
  _id: Joi.string().required(),
  pageID: Joi.number().required(),
  level: Joi.number().required(),
  menuGroupId: Joi.string().required(),
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

export const MenuPageIDRequest = {
  _id: Joi.string().required(),
  menuGroupId: Joi.string().required(),
};

export const MenuPageDetailsRequest = {
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
  menuGroupId: Joi.string().required(),
};

export const MenuPageOrderNumberRequest = {
  menuPageOrderNumbers: Joi.array().items({
    level: Joi.number().required(),
    _id: Joi.string().required(),
    orderNumber: Joi.number().required(),
  }),
  menuGroupId: Joi.string().required(),
};

export const MenuPageNameRequest = {
  name: Joi.string().required(),
  level: Joi.number().required(),
  _id: Joi.string().required(),
  menuGroupId: Joi.string().required(),
};

export const MenuPagesHideRequest = {
  updateMenuPagesHide: Joi.array()
    .items({
      level: Joi.number().required(),
      _id: Joi.string().required(),
    })
    .required(),
  isHide: Joi.boolean().required(),
  menuGroupId: Joi.string().required(),
};

export const MenuPageHomePageRequest = {
  updateMenuPageHomePage: Joi.object({
    previousLevel: Joi.number().allow(null),
    previousId: Joi.string().allow('').allow(null),
    currentLevel: Joi.number().required(),
    currentId: Joi.string().required(),
  }).required(),
  menuGroupId: Joi.string().required(),
};

export const MenuPageCreateRequest = {
  level: Joi.number().required(),
  page: Joi.object({
    parentID: Joi.string().allow('').allow(null),
    orderNumber: Joi.number().required(),
    masterPageID: Joi.string().allow('').allow(null),
    name: Joi.string().required(),
    isHide: Joi.boolean().required(),
    isHomepage: Joi.boolean().required(),
  }).required(),
  menuGroupId: Joi.string().required(),
};

export const MenuPagePageResponse = {
  _id: Joi.string().required(),
  parentID: Joi.string().allow('').allow(null),
  orderNumber: Joi.number().required(),
  masterPageID: Joi.string().allow('').allow(null),
  name: Joi.string().required(),
  isHide: Joi.boolean().required(),
  isHomepage: Joi.boolean().required(),
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

export const MenuPageRemoveFromContainerRequest = {
  menuPagePositions: Joi.array()
    .items({
      parentID: Joi.string().allow('').allow(null),
      level: Joi.number().required(),
      _id: Joi.string().required(),
    })
    .required(),
  menuPageOrderNumbers: Joi.array()
    .items({
      level: Joi.number().required(),
      _id: Joi.string().required(),
      orderNumber: Joi.number().required(),
    })
    .required(),
  menuGroupId: Joi.string().required(),
};

export const MenuPageUpdateFromToContainerRequest = {
  previousMenuPagePositions: Joi.array()
    .items({
      parentID: Joi.string().allow('').allow(null),
      level: Joi.number().required(),
      _id: Joi.string().required(),
    })
    .required(),
  nextMenuPagePositions: Joi.array()
    .items({
      parentID: Joi.string().allow('').allow(null),
      level: Joi.number().required(),
      _id: Joi.string().required(),
    })
    .required(),
  oldMenuPageOrderNumbers: Joi.array()
    .items({
      level: Joi.number().required(),
      _id: Joi.string().required(),
      orderNumber: Joi.number().required(),
    })
    .required(),
  newMenuPageOrderNumbers: Joi.array()
    .items({
      level: Joi.number().required(),
      _id: Joi.string().required(),
      orderNumber: Joi.number().required(),
    })
    .required(),
  menuGroupId: Joi.string().required(),
};
