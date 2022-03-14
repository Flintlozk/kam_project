import { Pipe, PipeTransform } from '@angular/core';
import { IMergedProductData, SocialTypes } from '@reactor-room/itopplus-model-lib';
import { flattenDeep } from 'lodash';

@Pipe({
  name: 'productStatusLinkedToMarketPlace',
})
export class ProductStatusLinkedToMarketPlace implements PipeTransform {
  transform(mergedProduct: IMergedProductData[], variantCount: number, marketType: SocialTypes): { status: boolean; count: number } {
    if (!mergedProduct?.length) return { status: false, count: 0 };
    const mergedVariantArray = mergedProduct?.map(({ mergedVariants }) => mergedVariants) || [];
    const mergedVariants = flattenDeep(mergedVariantArray);
    const mergedVariantLength = mergedVariants?.filter(({ marketPlaceVariantType }) => marketPlaceVariantType === marketType)?.length || 0;
    return mergedVariantLength === variantCount ? { status: true, count: mergedVariantLength } : { status: false, count: mergedVariantLength };
  }
}
