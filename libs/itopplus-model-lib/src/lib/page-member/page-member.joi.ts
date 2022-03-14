import * as Joi from 'joi';

export const PageMemberObjectValidate = {
  id: Joi.number().required(),
  page_id: Joi.number().required(),
  user_id: Joi.number().required().allow(null),
  name: Joi.string().allow(''),
  alias: Joi.string().allow('').allow(null),
  email: Joi.string().required(),
  notify_email: Joi.string().allow('').allow(null),
  role: Joi.string().required(),
  is_active: Joi.boolean(),
};

export const PageMemberAmount = {
  amount_of_users: Joi.number().required(),
};

export const PageMemberInviteInputValidate = {
  email: Joi.string().required(),
  role: Joi.string().required(),
};

export const PageMemberInviteInputObjectValidate = {
  inputData: PageMemberInviteInputValidate,
};

export const InvitationObjectValidateion = {
  from: Joi.string().required(),
  to: Joi.string().required(),
  subject: Joi.string().required(),
  attachments: Joi.array().items(
    Joi.object({
      fileName: Joi.string().required(),
      path: Joi.string().required(),
      cid: Joi.string().required(),
    }),
  ),
  html: Joi.string().required(),
};

export const TokenInputValidate = {
  token: Joi.string().required(),
};

export const invitationPageMemberPayloadValidate = {
  name: Joi.string().required(),
  email: Joi.string().required(),
  pageID: Joi.number().required(),
};
