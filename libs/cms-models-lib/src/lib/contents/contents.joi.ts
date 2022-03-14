import * as Joi from 'joi';

export const ContentsIdRequest = {
  _id: Joi.string().required(),
};

export const ContentsUpdateRequest = {
  _id: Joi.string().required(),
  isSaveAsDraft: Joi.boolean().required(),
  contents: Joi.object({
    name: Joi.string().required(),
    language: Joi.array()
      .items({
        cultureUI: Joi.string().required(),
        title: Joi.string().required(),
        subTitle: Joi.string().allow('').allow(null),
        keyword: Joi.string().allow('').allow(null),
      })
      .required(),
    categories: Joi.array(),
    tags: Joi.array(),
    authors: Joi.array(),
    isPin: Joi.boolean().required(),
    priority: Joi.number().required(),
    startDate: Joi.string().required(),
    isEndDate: Joi.boolean().required(),
    endDate: Joi.string().allow('').allow(null),
    views: Joi.number().required(),
    coverImage: Joi.string().allow('').allow(null),
    isPublish: Joi.boolean().required(),
    customCSS: Joi.string().allow('').allow(null),
    draftSections: Joi.array()
      .items({
        type: Joi.string().required(),
        gap: Joi.number().required(),
        columns: Joi.array().items({
          gap: Joi.number(),
          components: Joi.string().allow('').allow(null),
        }),
      })
      .required(),
    sections: Joi.array()
      .items({
        type: Joi.string().required(),
        gap: Joi.number().required(),
        columns: Joi.array().items({
          gap: Joi.number(),
          components: Joi.string().allow('').allow(null),
        }),
      })
      .required(),
  }).required(),
};

export const ContentsCategoriesRequest = {
  categories: Joi.array().allow('').allow(null),
  limit: Joi.number().required(),
};
export const ContentCategoriesRequest = {
  _id: Joi.string().allow(null),
  pageID: Joi.number().allow(null),
  name: Joi.string().required(),
  featuredImg: Joi.string().allow(null, ''),
  language: Joi.array().items({
    cultureUI: Joi.string().required(),
    name: Joi.string().required(),
    slug: Joi.string().allow(''),
    description: Joi.string().allow(''),
  }),
  parentId: Joi.string().allow(null),
  status: Joi.boolean(),
};
export const ContentsContentsRequest = {
  contents: Joi.object({
    name: Joi.string().required(),
    language: Joi.array()
      .items({
        cultureUI: Joi.string().required(),
        title: Joi.string().required(),
        subTitle: Joi.string().allow('').allow(null),
        keyword: Joi.string().allow('').allow(null),
      })
      .required(),
    categories: Joi.array(),
    tags: Joi.array(),
    authors: Joi.array(),
    isPin: Joi.boolean().required(),
    priority: Joi.number().required(),
    startDate: Joi.string().required(),
    isEndDate: Joi.boolean().required(),
    endDate: Joi.string().allow('').allow(null),
    views: Joi.number().required(),
    coverImage: Joi.string().allow('').allow(null),
    isPublish: Joi.boolean().required(),
    customCSS: Joi.string().allow('').allow(null),
    draftSections: Joi.array()
      .items({
        type: Joi.string().required(),
        gap: Joi.number().required(),
        columns: Joi.array().items({
          gap: Joi.number(),
          components: Joi.string().allow('').allow(null),
        }),
      })
      .required(),
    sections: Joi.array()
      .items({
        type: Joi.string().required(),
        gap: Joi.number().required(),
        columns: Joi.array().items({
          gap: Joi.number(),
          components: Joi.string().allow('').allow(null),
        }),
      })
      .required(),
  }).required(),
};

export const ContentsContentsResonse = {
  name: Joi.string().required(),
  language: Joi.array()
    .items({
      cultureUI: Joi.string().required(),
      title: Joi.string().required(),
      subTitle: Joi.string().allow('').allow(null),
      keyword: Joi.string().allow('').allow(null),
    })
    .required(),
  categories: Joi.array(),
  tags: Joi.array(),
  authors: Joi.array(),
  isPin: Joi.boolean().required(),
  priority: Joi.number().required(),
  startDate: Joi.string().required(),
  isEndDate: Joi.boolean().required(),
  endDate: Joi.string().allow('').allow(null),
  views: Joi.number().required(),
  coverImage: Joi.string().allow('').allow(null),
  isPublish: Joi.boolean().required(),
  customCSS: Joi.string().allow('').allow(null),
  draftSections: Joi.array()
    .items({
      type: Joi.string().required(),
      gap: Joi.number().required(),
      columns: Joi.array().items({
        gap: Joi.number(),
        components: Joi.array().items({
          type: Joi.string().allow('').allow(null),
          quillHTMLs: Joi.array().items({
            cultureUI: Joi.string().allow('').allow(null),
            quillHTML: Joi.string().allow('').allow(null),
          }),
        }),
      }),
    })
    .required(),
  sections: Joi.array()
    .items({
      type: Joi.string().required(),
      gap: Joi.number().required(),
      columns: Joi.array().items({
        gap: Joi.number(),
        components: Joi.array().items({
          type: Joi.string().allow('').allow(null),
          quillHTMLs: Joi.array().items({
            cultureUI: Joi.string().allow('').allow(null),
            quillHTML: Joi.string().allow('').allow(null),
          }),
        }),
      }),
    })
    .required(),
};
