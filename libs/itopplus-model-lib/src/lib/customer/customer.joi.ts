import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';

Joi.extend(JoiDate);

export const customerObjectValidate = {
  id: Joi.number().required(),
  first_name: Joi.string().allow(null).allow(''), // email: Joi.string().email({ minDomainSegments: 2 }),
  last_name: Joi.string().allow(null).allow(''),
  email: Joi.string().allow(null),
  phone_number: Joi.string().allow(null).allow(''),
  notes: Joi.string().allow(null).allow(''),
  province: Joi.string().allow(null).allow(''),
  profile_pic: Joi.any(),
  location: {
    address: Joi.string().allow(null).allow(''),
    district: Joi.string().allow(null).allow(''),
    amphoe: Joi.string().allow(null).allow(''),
    country: Joi.string().allow(null).allow(''),
    post_code: Joi.string().allow(null).allow(''),
  },
  social: Joi.object()
    .keys({
      Facebook: Joi.string().allow(null).allow(''),
      Line: Joi.string().allow(null).allow(''),
      Instagram: Joi.string().allow(null).allow(''),
      Twitter: Joi.string().allow(null).allow(''),
      Google: Joi.string().allow(null).allow(''),
      Youtube: Joi.string().allow(null).allow(''),
    })
    .allow(null),
  nickname: Joi.string().allow(null).allow(''),
  Facebook: {
    PSID: Joi.string().allow(null).allow(''),
    ASID: Joi.string().allow(null).allow(''),
    first_name: Joi.string().allow(null).allow(''),
    last_name: Joi.string().allow(null).allow(''),
    nickname: Joi.string().allow(null).allow(''),
    email: Joi.string().allow(null).allow(''),
    profile_pic: Joi.string().allow(null).allow(''),
    accessToken: Joi.string().allow(null).allow(''),
  },
  tags: {
    tagMappingID: Joi.number().allow(null).allow(''),
    name: Joi.string().allow(null).allow(''),
    color: Joi.string().allow(null).allow(''),
    id: Joi.number().allow(null).allow(''),
  },
  createdAt: Joi.string().allow('').allow(null),
  updatedAt: Joi.string().allow('').allow(null),
  deletedAt: Joi.string().allow('').allow(null),
};

export const customerResponseObject = {
  status: Joi.number(),
  value: Joi.string(),
};

export const customerCanReplyObject = {
  canReply: Joi.boolean().required(),
  id: Joi.string().required(),
};

export const responseCustomerNotes = {
  name: Joi.string().allow('').allow(null),
  created_at: Joi.string(),
  updated_at: Joi.string(),
  note: Joi.string().allow('').allow(null),
  id: Joi.number().required(),
};

export const UserMadeLastChangesObject = {
  id: Joi.number().allow(null),
  name: Joi.string().allow('').allow(null),
  created_at: Joi.string().allow('').allow(null),
};

export const customerResponseOrdersObject = {
  id: Joi.number(),
  total_price: Joi.string().allow('').allow(null),
  created_at: Joi.string(),
  po_status: Joi.string(),
  payment_type: Joi.string().allow('').allow(null),
  a_status: Joi.string(),
  totalrows: Joi.number(),
};

export const customerUpdateByFormObjectValidate = {
  customer: Joi.object().keys({
    id: Joi.number().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().allow(null).allow(''),
    email: Joi.string().allow(null).allow(''),
    phone_number: Joi.string().allow(null).allow(''),

    profile_pic: Joi.any(),
    location: {
      address: Joi.string().allow(null).allow(''),
      district: Joi.string().allow(null).allow(''),
      province: Joi.string().allow(null).allow(''),
      city: Joi.string().allow(null).allow(''),
      post_code: Joi.string().allow(null).allow(''),
      country: Joi.string().allow(null).allow(''),
    },

    aliases: Joi.optional(),
  }),
};

export const companyInputValidate = {
  info: {
    id: Joi.number().allow(null).allow(''),
    company_name: Joi.string().allow(null).allow(''),
    company_logo: Joi.string().allow(null).allow(''),
    company_logo_file: Joi.any(),
    branch_name: Joi.string().allow(null).allow(''),
    branch_id: Joi.string().allow(null).allow(''),
    tax_id: Joi.string().allow(null).allow(''),
    phone_number: Joi.string().allow(null).allow(''),
    email: Joi.string().allow(null).allow(''),
    fax: Joi.string().allow(null).allow(''),
    address: Joi.string().allow(null).allow(''),
    country: Joi.string().allow(null).allow(''),
    location: {
      post_code: Joi.string().allow(null).allow(''),
      city: Joi.string().allow(null).allow(''),
      district: Joi.string().allow(null).allow(''),
      province: Joi.string().allow(null).allow(''),
    },
  },
  shipping: {
    use_company_address: Joi.boolean().required(),
    shipping_phone_number: Joi.string().allow(null).allow(''),
    shipping_email: Joi.string().allow(null).allow(''),
    shipping_fax: Joi.string().allow(null).allow(''),
    shipping_address: Joi.string().allow(null).allow(''),
    location: {
      post_code: Joi.string().allow(null).allow(''),
      city: Joi.string().allow(null).allow(''),
      district: Joi.string().allow(null).allow(''),
      province: Joi.string().allow(null).allow(''),
    },
    shipping_country: Joi.string().allow(null).allow(''),
  },
  stored_members: Joi.array().items({
    id: Joi.number(),
    psid: Joi.string().allow(null).allow(''),
    first_name: Joi.string().allow(null).allow(''),
    last_name: Joi.string().allow(null).allow(''),
    profile_pic: Joi.string().allow(null).allow(''),
    line_user_id: Joi.string().allow(null).allow(''),
    totalrows: Joi.number().allow(null).allow(''),
    action_type: Joi.any().allow(null).allow(''),
  }),
  updated_members: Joi.array().items({
    id: Joi.number(),
    psid: Joi.string().allow(null).allow(''),
    first_name: Joi.string().allow(null).allow(''),
    last_name: Joi.string().allow(null).allow(''),
    profile_pic: Joi.string().allow(null).allow(''),
    line_user_id: Joi.string().allow(null).allow(''),
    totalrows: Joi.number().allow(null).allow(''),
    action_type: Joi.any().allow(null).allow(''),
  }),
};
