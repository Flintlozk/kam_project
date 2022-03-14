import { IProductMarketPlaceConnected } from '@reactor-room/model-lib';
import { IVariantsOfProductByID, SocialTypes } from '@reactor-room/itopplus-model-lib';
import { flattenDeep } from 'lodash';

export const getProductStatusLinkedToMarketPlace = (variants: IVariantsOfProductByID[]): IProductMarketPlaceConnected => {
  try {
    const variantLength = variants?.length;
    const socialMarketPlaceType = [SocialTypes.LAZADA, SocialTypes.SHOPEE];
    const marketPlaceExistsObj = {
      [SocialTypes.LAZADA]: false,
      [SocialTypes.SHOPEE]: false,
    };
    if (variantLength) {
      socialMarketPlaceType?.map((marketPlace) => {
        const marketPlaceVariants = flattenDeep(variants?.map(({ variantMarketPlaceMerged }) => variantMarketPlaceMerged)?.filter((mergedVariant) => mergedVariant)) || [];
        const marketPlaceVariantCount = marketPlaceVariants.filter(({ marketPlaceVariantType }) => marketPlaceVariantType === marketPlace)?.length || 0;
        marketPlaceExistsObj[marketPlace] = variantLength === marketPlaceVariantCount ? true : false;
      });
    }

    return marketPlaceExistsObj;
  } catch (error) {
    console.log('error --> getProductStatusLinkedToMaarketPlace', error);
    throw new Error(error);
  }
};
