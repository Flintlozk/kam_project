import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';
Joi.extend(JoiDate);

export const IProductLowInventoryListValidate = {
  id: Joi.number().required(),
  name: Joi.string(),
  createdAt: Joi.date(),
  images: Joi.array().items(Joi.object()).allow(null).allow(''),
  subProductLowInventory: Joi.array()
    .items(
      Joi.object().keys({
        subIsLower: Joi.boolean().required(),
        subImages: Joi.array().items(Joi.object()).allow(null).allow(''),
        subNameProductVariant: Joi.string().allow(null).allow(''),
        subInventory: Joi.number().allow(null).allow(''),
        subUnit_price: Joi.number().allow(null).allow(''),
        subWithhold: Joi.number().allow(null).allow(''),
        subUnpaid: Joi.number().allow(null).allow(''),
        subRevenue: Joi.number().allow(null).allow(''),
      }),
    )
    .allow(null),
  variants: Joi.number().allow(null).allow(''),
  isLower: Joi.boolean().allow(null).allow(''),
  inventory: Joi.number().allow(null).allow(''),
  withhold: Joi.number().allow(null).allow(''),
  unpaid: Joi.number().allow(null).allow(''),
  revenue: Joi.number().allow(null).allow(''),
  totalrows: Joi.number().required(),
  status: Joi.boolean().allow(null).allow(''),
  idIndex: Joi.number().required(),
};

export const IProductLowStockTotalValidate = {

  sumLowStock: Joi.number(),
};
