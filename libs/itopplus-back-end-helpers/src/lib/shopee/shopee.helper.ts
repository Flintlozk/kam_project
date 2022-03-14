import { concatObjToParamsBackend } from '@reactor-room/itopplus-back-end-helpers';
import { IUrlParams } from '@reactor-room/model-lib';
import {
  BRAND_ID,
  IProductByID,
  IProductMarketPlaceLatestByType,
  IShopeeAttributes,
  IShopeeCommonParams,
  IShopeeCommonParamsPost,
  IShopeeCreateProductAttribute,
  IShopeeCreateProductBrand,
  IShopeeCreateProductVariation,
  IShopeeCreateUpdateProductLogistic,
  IShopeeCreateUpdateProductRequired,
  IShopeeEnv,
  IShopeeLogistics,
  IShopeePostRequestParmas,
  IShopeeProductBaseInfo,
  IShopeeProductList,
  IShopeeProductUpdatePayload,
  IShopeeRequestParmas,
  IShopeeUpdateDateOptions,
  IShopeeUpdateProductVariant,
  IShopeeVariationCreate,
  IShopeeVariationModel,
  IShopeeVariationModelResponse,
  IShopeeVariationTier,
  IVariantsOfProductByID,
  ProductStatus,
  ShopeeInputValidationTypes,
  ShopeeItemStatusTypes,
  ShopeeOrderDetailsOptionalFieldTypes,
} from '@reactor-room/itopplus-model-lib';
import { createHmac } from 'crypto';
import { flattenDeep, isEmpty, uniqBy } from 'lodash';
import { addDaysToTimestamp, getDifferenceOfUnixTimestamp, getUTCUnixTimestampByDate, getUTCUnixTimestamps } from '../utc.helper';

const DEFAULT_ATTRIBUTE_TYPE = 'ITEM';
const DEFAULT_OPTION_TYPE = 'OPTION';
const SHOPEE_NAME_MIN_LENGTH = 20;
const SHOPEE_NAME_MAX_LENGTH = 120;

const SHOPEE_DESC_MIN_LENGTH = 25;
const SHOPEE_DESC_MAX_LENGTH = 5000;

const SHOPEE_PRODUCT_BASIC_INFO_LIMIT = 50;

export const getShopeeSignCode = (path: string, shopeeEnv: IShopeeEnv, shop_id = null): [number, string] => {
  const { shopeeAppID, shopeeAppSecret, shopeeSignInMethod } = shopeeEnv;
  const timestamp = getUTCUnixTimestamps();
  let baseString = '';
  if (shop_id) {
    baseString = `${shopeeAppID}${path}${timestamp}${shop_id}`;
  } else {
    baseString = `${shopeeAppID}${path}${timestamp}`;
  }
  const signInCode = createHmac(shopeeSignInMethod, shopeeAppSecret).update(baseString).digest('hex');
  return [timestamp, signInCode];
};

export const getShopeeAccessTokenUrl = (code: string, shopID: string, shopeeEnv: IShopeeEnv): IUrlParams => {
  const shop_id = +shopID;
  const { shopeeAppID: partner_id, shopeeUrl, shopeeAccessTokenPath } = shopeeEnv;
  const [timestamp, sign] = getShopeeSignCode(shopeeAccessTokenPath, shopeeEnv, shop_id);
  const shopeeAccessTokenUrlParams = concatObjToParamsBackend({
    partner_id,
    shop_id,
    timestamp,
    sign,
  });
  const urlParams = {
    code,
    shop_id,
    partner_id,
  };
  const shopeeAccessTokenUrl = `${shopeeUrl}${shopeeAccessTokenPath}${shopeeAccessTokenUrlParams}`;
  return { url: shopeeAccessTokenUrl, urlParams };
};

export const getShopeeCommonParamsV2 = ({ access_token, shop_id, shopeeEnv, path }: IShopeeRequestParmas): IShopeeCommonParams => {
  const { shopeeAppID: partner_id } = shopeeEnv;
  const [timestamp, sign] = getShopeeSignCodeV2({ access_token, shop_id, shopeeEnv, path });
  return {
    partner_id,
    timestamp,
    access_token,
    shop_id,
    sign,
  };
};

export const getShopeeSignCodeV2 = ({ access_token, shop_id, shopeeEnv, path }: IShopeeRequestParmas): [number, string] => {
  const { shopeeAppID, shopeeAppSecret, shopeeSignInMethod } = shopeeEnv;
  const timestamp = getUTCUnixTimestamps();
  const baseString = `${shopeeAppID}${path}${timestamp}${access_token}${shop_id}`;
  const signInCode = createHmac(shopeeSignInMethod, shopeeAppSecret).update(baseString).digest('hex');
  return [timestamp, signInCode];
};

export const getShopeeCommonParamsPostV2 = ({ shopeeEnv, path }: IShopeeRequestParmas): IShopeeCommonParamsPost => {
  const { shopeeAppID: partner_id } = shopeeEnv;
  const [timestamp, sign] = getShopeeSignCodePostV2({ shopeeEnv, path });
  return {
    partner_id,
    timestamp,
    sign,
  };
};

export const getShopeeSignCodePostV2 = ({ shopeeEnv, path }: IShopeePostRequestParmas): [number, string] => {
  const { shopeeAppID: partner_id, shopeeAppSecret, shopeeSignInMethod } = shopeeEnv;
  const timestamp = getUTCUnixTimestamps();
  const baseString = `${partner_id}${path}${timestamp}`;
  const signInCode = createHmac(shopeeSignInMethod, shopeeAppSecret).update(baseString).digest('hex');
  return [timestamp, signInCode];
};

export const extractShopeeLogistics = (logistics: IShopeeLogistics[]): IShopeeCreateUpdateProductLogistic[] => {
  const logistic: IShopeeCreateUpdateProductLogistic[] = logistics.map((logistic) => ({
    logistic_id: logistic.logistics_channel_id,
    enabled: logistic.enabled,
  }));
  return logistic;
};

export const extractBrandForShopee = (attributes: string, original_brand_name: string): IShopeeCreateProductBrand => {
  const attributeArray = JSON.parse(attributes);
  const attributeRequired = attributeArray[0];
  const attributeNotRequired = attributeArray[1];
  const attributesObj = {
    ...attributeRequired,
    ...attributeNotRequired,
  };
  const brand_id = attributesObj[BRAND_ID] || null;
  return {
    brand_id,
    original_brand_name,
  };
};

export const extractAttributesForShopee = (attributes: string, attributeList: IShopeeAttributes[]): IShopeeCreateProductAttribute[] => {
  const attributeArray = JSON.parse(attributes);

  const attributeRequired = attributeArray[0];
  const attributeNotRequired = attributeArray[1];

  const attributesUserInput = attributeList?.filter(
    (attribute) => attribute.is_mandatory === false && !attribute?.attribute_value_list?.length && !attribute?.attribute_unit?.length,
  );

  const attributesObj = {
    ...attributeRequired,
    ...attributeNotRequired,
  };

  delete attributesObj.attribute_id;
  delete attributesObj['-100'];

  const attributeUserInputList: IShopeeCreateProductAttribute[] = getAttributeUserInputList(attributesUserInput, attributesObj);

  const attributePayload = Object.keys(attributesObj)
    .map((item) => {
      const value = attributesObj[item];
      return {
        attribute_id: Number(item),
        attribute_value_list: value
          ? [
              {
                value_id: value,
              },
            ]
          : null,
      };
    })
    .filter((e) => e.attribute_value_list) as unknown as IShopeeCreateProductAttribute[];
  const attributesPayloadList: IShopeeCreateProductAttribute[] = getAttributeListWithFormatedDate([...attributePayload, ...attributeUserInputList], attributeList);
  return attributesPayloadList;
};

export const generateShopeeProductNameOrDescription = (text: string, minLength: number, maxLength: number): string => {
  const nameLength = text.length;
  if (nameLength > minLength && nameLength < maxLength) return text;
  if (nameLength < minLength) {
    const nameSlot = Math.ceil(minLength / nameLength);
    let generatedName = '';
    for (let index = 0; index < nameSlot; index++) {
      generatedName = `${generatedName} ${text}`;
    }
    return generatedName.trim();
  } else {
    return text.substring(0, maxLength);
  }
};

export const getShopeeCreateProductObj = (
  categoryID: number,
  product: IProductByID,
  logisticObj: IShopeeCreateUpdateProductLogistic[],
  variantObj: IShopeeCreateProductVariation[] | IShopeeUpdateProductVariant[],
  attributesObj: IShopeeCreateProductAttribute[],
  shopeeImageData: string[],
  brandObj: IShopeeCreateProductBrand,
): IShopeeCreateUpdateProductRequired => {
  const { name, description, weight, code: item_sku, dimension } = product;
  const { height, length, width } = dimension;
  const sortByVariantPrice: IShopeeCreateProductVariation[] = variantObj?.sort((a, b) => a.price - b.price) as IShopeeCreateProductVariation[];
  let totalStock = 0;
  sortByVariantPrice.map((item) => {
    totalStock += item.stock;
  });

  const createPayload = {
    original_price: sortByVariantPrice[0].price,
    weight: +weight,
    item_name: generateShopeeProductNameOrDescription(name, SHOPEE_NAME_MIN_LENGTH, SHOPEE_NAME_MAX_LENGTH),
    description: generateShopeeProductNameOrDescription(description, SHOPEE_DESC_MIN_LENGTH, SHOPEE_DESC_MAX_LENGTH),
    item_status: ShopeeItemStatusTypes.NORMAL,
    dimension: {
      package_length: +length,
      package_width: +width,
      package_height: +height,
    },
    normal_stock: totalStock,
    logistic_info: logisticObj,
    attribute_list: attributesObj,
    category_id: categoryID,
    image: {
      image_id_list: shopeeImageData,
    },
    item_sku,
  };
  return !isEmpty(brandObj) ? { ...createPayload, brand: { ...brandObj } } : createPayload;
};

export const getShopeeUpdateProductPayload = (
  product: IProductByID,
  { item_sku, condition, pre_order, category_id, item_id, logistic_info }: IShopeeProductBaseInfo,
): IShopeeProductUpdatePayload => {
  const {
    name,
    description,
    weight,
    dimension: { height, length, width },
    status,
  } = product;
  const item_status = status === (ProductStatus.OUT_OF_STOCk || ProductStatus.CANCEL) ? ShopeeItemStatusTypes.UNLIST : ShopeeItemStatusTypes.NORMAL;
  return {
    item_name: generateShopeeProductNameOrDescription(name, SHOPEE_NAME_MIN_LENGTH, SHOPEE_NAME_MAX_LENGTH),
    description: generateShopeeProductNameOrDescription(description, SHOPEE_DESC_MIN_LENGTH, SHOPEE_DESC_MAX_LENGTH),
    item_sku,
    condition,
    pre_order,
    category_id,
    item_id,
    item_status,
    logistic_info,
    weight: +weight,
    dimension: {
      package_height: +height,
      package_length: +length,
      package_width: +width,
    },
  };
};

export const extractVariantForShopee = (variants: IVariantsOfProductByID[], variantIDs: number[], productName: string): IShopeeCreateProductVariation[] => {
  const selectedVariants = variants.filter((variant) => variantIDs.some((id) => id === variant.variantID));
  const variantObj: IShopeeCreateProductVariation[] = selectedVariants.map((variant) => ({
    name: variant.variantAttributes.map((attr) => attr.name).join('-') || productName,
    stock: +variant.variantInventory,
    price: +variant.variantUnitPrice,
    variation_sku: variant.variantSKU,
  }));
  return variantObj;
};

export const extractVariationPayloadForShopee = (item_id: number, variants: IVariantsOfProductByID[], variantIDs: number[], variantImageData: string[]): IShopeeVariationCreate => {
  const selectedVariants = variants.filter((variant) => variantIDs.some((id) => id === variant.variantID));
  const variantAttributeTypeList = flattenDeep(selectedVariants?.map(({ variantAttributes }) => variantAttributes) || []);
  const uniqueVariantAttributeTypeList = uniqBy(variantAttributeTypeList, 'attributeID');
  const uniqueVariantAttributeList = uniqBy(variantAttributeTypeList, 'id');
  const tier_variation: IShopeeVariationTier[] = uniqueVariantAttributeTypeList.map((attr) => ({
    name: attr?.attributeType || DEFAULT_ATTRIBUTE_TYPE,
    option_list: uniqueVariantAttributeList
      .filter((list) => list.attributeID === attr.attributeID)
      .map((attrList, index) => {
        const options = {
          option: attrList?.name || DEFAULT_OPTION_TYPE,
        };
        if (attrList?.name) {
          options['image'] = {
            image_id: variantImageData[index],
          };
        }
        return options;
      }),
  }));
  const tierIndex = getTierIndex(uniqueVariantAttributeTypeList.length, tier_variation);
  const model: IShopeeVariationModel[] = selectedVariants.map((variant, index) => {
    return {
      tier_index: tierIndex[index],
      normal_stock: variant.variantInventory,
      original_price: variant.variantUnitPrice,
      model_sku: variant.variantSKU,
    };
  });
  return {
    item_id,
    tier_variation,
    model,
  };
};

export const getShopeeTwoWeekDateSlots = ({ update_time_from, update_time_to }: IShopeeUpdateDateOptions): IShopeeUpdateDateOptions[] => {
  if (!isEmpty({ update_time_from, update_time_to })) {
    const numberOfDays = getDifferenceOfUnixTimestamp(update_time_from, update_time_to);
    const twoWeekDays = 14;
    if (numberOfDays <= twoWeekDays) {
      return [{ update_time_from, update_time_to }];
    } else {
      const weekSlot = Math.ceil(numberOfDays / twoWeekDays);
      let weekSlotArr = [];
      for (let index = 1; index < weekSlot; index++) {
        const twoWeekDate = addDaysToTimestamp(update_time_from, index * twoWeekDays);
        weekSlotArr.push(twoWeekDate);
      }
      weekSlotArr = [update_time_from, ...weekSlotArr, update_time_to];
      const timeStampSlots = weekSlotArr.map((timestamp, index) => ({
        update_time_from: timestamp,
        update_time_to: weekSlotArr[index + 1],
      }));
      return timeStampSlots.slice(0, timeStampSlots.length - 1);
    }
  } else {
    return null;
  }
};

export const getTierIndex = (attrLength: number, tierVariations: IShopeeVariationTier[]): [number[]] => {
  const tierIndex = [];
  if (attrLength === 1) {
    const variantLength = tierVariations[0]?.option_list?.length;
    for (let i = 0; i < variantLength; i++) {
      tierIndex.push([i]);
    }
  }

  if (attrLength === 2) {
    const variation1 = tierVariations[0]?.option_list?.length;
    const variation2 = tierVariations[1]?.option_list?.length;
    for (let i = 0; i < variation1; i++) {
      for (let j = 0; j < variation2; j++) {
        tierIndex.push([i, j]);
      }
    }
  }
  return tierIndex as [number[]];
};

export const getShopeeProductListUpdateParams = (latestProduct: IProductMarketPlaceLatestByType): IShopeeUpdateDateOptions => {
  if (isEmpty(latestProduct)) return {} as IShopeeUpdateDateOptions;
  const { createdAt } = latestProduct;
  return {
    update_time_from: getUTCUnixTimestampByDate(createdAt),
    update_time_to: getUTCUnixTimestamps(),
  };
};

export const getShopeeProductIDsForBasicInfo = (shopeeProducts: IShopeeProductList[]): number[][] => {
  if (!shopeeProducts?.length) return [];
  const looper = Math.ceil(shopeeProducts.length / SHOPEE_PRODUCT_BASIC_INFO_LIMIT);
  const productIDSLots = [] as number[][];
  const productIDList = shopeeProducts.map(({ item_id }) => item_id);
  for (let index = 0; index < looper; index++) {
    const startPoint = index * SHOPEE_PRODUCT_BASIC_INFO_LIMIT;
    const endPoint = SHOPEE_PRODUCT_BASIC_INFO_LIMIT * (index + 1);
    const productIDs = productIDList.slice(startPoint, endPoint);
    productIDSLots.push(productIDs);
  }
  return productIDSLots;
};

export const getShopeeVariationName = (tier_variation: IShopeeVariationTier[], model: IShopeeVariationModelResponse[], tierVariationLevel: number, index: number): string => {
  if (tierVariationLevel === 1) {
    return tier_variation[0]?.option_list[index].option || 'N/A';
  } else {
    const tireIndex1 = model[index].tier_index[0];
    const tireIndex2 = model[index].tier_index[1];
    return `${tier_variation[0]?.option_list[tireIndex1]?.option || 'N/A'}, ${tier_variation[1]?.option_list[tireIndex2]?.option || 'N/A'}` || 'N/A';
  }
};

export const getAttributeUserInputList = (attributesUserInput: IShopeeAttributes[], attributesObj: { [key: string]: string }): IShopeeCreateProductAttribute[] => {
  const notRequiredAttributeValueID = 0; //shopee api required value to be 0 for non required attribute
  if (attributesUserInput?.length) {
    return attributesUserInput?.map((attribute) => {
      const attributeUserInputObj = {
        attribute_id: attribute.attribute_id,
        attribute_value_list: [
          {
            value_id: notRequiredAttributeValueID,
            original_value_name: attributesObj[attribute.attribute_id] || null,
          },
        ],
      };
      delete attributesObj[attribute.attribute_id];
      return attributeUserInputObj;
    });
  } else {
    return [] as IShopeeCreateProductAttribute[];
  }
};

export const getAttributeListWithFormatedDate = (attributePayload: IShopeeCreateProductAttribute[], attributeList: IShopeeAttributes[]): IShopeeCreateProductAttribute[] => {
  const dateAttributeIds =
    attributeList?.filter((attribute) => attribute.input_validation_type === ShopeeInputValidationTypes.DATE_TYPE)?.map(({ attribute_id }) => attribute_id) || [];
  if (dateAttributeIds?.length) {
    dateAttributeIds.map((attributeID) => {
      const datePayload = attributePayload.find((attr) => +attr.attribute_id === +attributeID);
      const dateUnFormatted = datePayload?.attribute_value_list[0]?.original_value_name;
      const dateFormatted = String(getUTCUnixTimestampByDate(new Date(dateUnFormatted)));
      datePayload.attribute_value_list[0].original_value_name = dateFormatted;
    });
    return attributePayload;
  } else {
    return attributePayload;
  }
};

export const getShopeeOrderDetailsResponseFields = (): string => {
  const { ITEM_LIST, TOTAL_AMOUNT, ESTIMATED_SHIPPING_FEE } = ShopeeOrderDetailsOptionalFieldTypes;
  return `${ITEM_LIST},${TOTAL_AMOUNT},${ESTIMATED_SHIPPING_FEE}`;
};
