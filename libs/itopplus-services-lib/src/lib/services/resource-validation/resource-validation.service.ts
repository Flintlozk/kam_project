import { ICount } from '@reactor-room/model-lib';
import {
  EnumAuthError,
  EnumResourceValidation,
  EnumResourceValidationError,
  IPlanLimitAndDetails,
  IProductVariantDB,
  IResourcesValidationResponse,
} from '@reactor-room/itopplus-model-lib';
import {
  getAllPOByDate,
  getAllPOInMonth,
  getPageMemberCountByPageID,
  getPagesFromSubscriptionID,
  getProductsByPageID,
  getSubscriptionActiveHistory,
  getSubscriptionByPageID,
  getSubscriptionLimitAndDetails,
} from '../../data';
import { ResourceValidationError } from '../../errors/resourceValidation.error';
import { PlusmarService } from '../plusmarservice.class';

export class ResourceValidationService {
  isPageMemberCreatable = async (max: number, pageID: number): Promise<boolean> => {
    const countPageMembers: ICount = await getPageMemberCountByPageID(PlusmarService.readerClient, pageID);
    if (!countPageMembers) return false;
    if (countPageMembers.count >= max) {
      return false;
    }
    return true;
  };

  isPageCreatable = async (max: number, subscriptionID: string): Promise<boolean> => {
    const countPages: ICount = await getPagesFromSubscriptionID(PlusmarService.readerClient, subscriptionID);
    if (!countPages) return false;
    if (countPages.count >= max) return false;
    return true;
  };

  isAudienceCreatable = async (max: number, pageID: number): Promise<boolean> => {
    const countPageMember: ICount = await getPageMemberCountByPageID(PlusmarService.readerClient, pageID);
    if (!countPageMember) return false;
    if (countPageMember.count >= max) return false;
    return true;
  };

  isOrderCreatable = async (pageID: number): Promise<boolean> => {
    const subscription = await getSubscriptionByPageID(PlusmarService.readerClient, pageID);

    const subscriptionLimit = await getSubscriptionLimitAndDetails(PlusmarService.readerClient, subscription.id);
    let poStats;
    if (subscription.planId === 1) {
      poStats = await getAllPOInMonth(PlusmarService.readerClient, pageID);
    } else {
      const subscriptionActiveHistory = await getSubscriptionActiveHistory(PlusmarService.readerClient, subscription.id);
      poStats = await getAllPOByDate(PlusmarService.readerClient, pageID, subscriptionActiveHistory.actived_date);
    }
    if (poStats.length >= subscriptionLimit.maximumOrders) return false;
    return true;
  };

  isProductCreatable = async (max: number, pageID: number): Promise<boolean> => {
    const products: IProductVariantDB[] = await getProductsByPageID(PlusmarService.readerClient, pageID);
    if (products.length >= max) return false;
    return true;
  };

  validateResources = async (subscriptionID: string, pageID: number, validations: EnumResourceValidation[], limit: IPlanLimitAndDetails): Promise<IResourcesValidationResponse> => {
    const result = validations.map(async (validation) => {
      let isCreatable;
      switch (validation) {
        case EnumResourceValidation.VALIDATE_MAX_PAGE_MEMBERS:
          isCreatable = await this.isPageMemberCreatable(limit.maximumMembers, pageID);
          if (!isCreatable) throw new ResourceValidationError(EnumResourceValidationError.MEMBER_REACHED_LIMIT);
          return true;
        case EnumResourceValidation.VALIDATE_MAX_PAGES:
          isCreatable = await this.isPageCreatable(limit.maximumPages, subscriptionID);
          if (!isCreatable) throw new ResourceValidationError(EnumAuthError.PAGE_REACHED_LIMIT);
          return true;
        case EnumResourceValidation.VALIDATE_MAX_AUDIENCES:
          isCreatable = await this.isAudienceCreatable(limit.maximumLeads, pageID);
          if (!isCreatable) throw new ResourceValidationError(EnumResourceValidationError.AUDIENCE_REACHED_LIMIT);
          return true;
        case EnumResourceValidation.VALIDATE_MAX_ORDERS:
          isCreatable = await this.isOrderCreatable(pageID);
          if (!isCreatable) throw new ResourceValidationError(EnumResourceValidationError.ORDER_REACHED_LIMIT);
          return true;
        case EnumResourceValidation.VALIDATE_MAX_PRODUCTS:
          isCreatable = await this.isProductCreatable(limit.maximumProducts, pageID);
          if (!isCreatable) throw new ResourceValidationError(EnumResourceValidationError.PRODUCT_REACHED_LIMIT);
          return true;
        default:
          break;
      }
    });

    await Promise.all(result);
    return { isCreatable: false };
  };
}
