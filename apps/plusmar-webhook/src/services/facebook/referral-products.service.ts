import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { AudienceDomainType, HasProductVariant, IAudience, ICustomerTemp, LeadsDomainStatus, ReferralProductType } from '@reactor-room/itopplus-model-lib';
import { PlusmarService, ProductWebhookCommunicationService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import { isEmpty } from 'lodash';
import { WebHookHelpers } from '../../domains/webhook.domain';
import { FacebookReferralProductHandlerError } from '../../errors';
import { SharedService } from '../shared/shared.service';

export class ReferralProductHandler {
  private webhookHelper = new WebHookHelpers();
  private sharedService = new SharedService();
  private productWebhookService = new ProductWebhookCommunicationService();

  public start = async (webhook): Promise<boolean> => {
    ///for referral products domain should be AUDIENCE
    const allowCreateAudience = true;
    const handleDefault = await this.sharedService.start(webhook, AudienceDomainType.AUDIENCE, LeadsDomainStatus.FOLLOW, AudiencePlatformType.FACEBOOKFANPAGE, allowCreateAudience);
    if (handleDefault.isPageNotFound) return false; // isPageNotFound may be this page not belong to us.

    const audience = handleDefault.audience; // === false Mean not to create Audience
    const customer = handleDefault.customer;
    const isAudienceCreated = handleDefault.isAudienceCreated;
    const subscriptionID = handleDefault.page.subscription_id;
    // such as 'Refferal / Job (Facebook) but We need to make sure our logic is right we must not keep the data without audience.
    if (!isAudienceCreated) return false; // in case not create Audience and we ignore this message by ack()
    if (!audience) return false;

    const { ref } = this.webhookHelper.getReferralFromMessage(webhook);
    if (!ref) return false;
    const refType = this.webhookHelper.getReferralProductType(ref);
    return await this.handleProductReferral(refType, ref, customer, audience, subscriptionID);
  };

  async handleProductReferral(referralType: ReferralProductType, ref: string, customer: ICustomerTemp, audience: IAudience, subscriptionID: string): Promise<boolean> {
    switch (referralType) {
      case ReferralProductType.PRODUCT:
        return await this.processReferralProduct(ref, customer, audience, subscriptionID);
      case ReferralProductType.PRODUCT_VARIANT: {
        const { page_id, id } = audience;
        const { psid } = customer;
        return await this.processReferralProductVariant(page_id, id, psid, ref, subscriptionID);
      }
      default:
        // ? : in case of Error in processing product referral
        return false;
    }
  }

  async processReferralProduct(ref: string, customer: ICustomerTemp, audience: IAudience, subscriptionID: string): Promise<boolean> {
    const { page_id, id } = audience;
    const { psid } = customer;
    const isProductVariant = await this.productWebhookService.hasProductVariant(page_id, ref);
    if (isEmpty(isProductVariant)) return false;

    switch (isProductVariant) {
      case HasProductVariant.NO_PRODUCT_VARIANT:
        return await this.productWithNoVariants(page_id, id, psid, ref, subscriptionID);
      case HasProductVariant.YES_PRODUCT_VARIANT:
        return await this.productWithVariants(page_id, id, psid, ref, subscriptionID);
      case HasProductVariant.NO_PRODUCT_FOUND:
        return false;
    }
  }
  async productWithVariants(page_id: number, id: number, psid: string, ref: string, subscriptionID): Promise<boolean> {
    try {
      await this.productWebhookService.handleProductRichMenu(page_id, psid, ref, id, subscriptionID);

      return true;
    } catch (error) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(new FacebookReferralProductHandlerError(error));
      return false;
    }
  }

  async productWithNoVariants(pageID: number, audienceID: number, psid: string, productRef: string, subscriptionID: string): Promise<boolean> {
    try {
      const variant = await this.productWebhookService.getVariantFromProductRef(pageID, productRef);
      if (!variant) return false;

      const { ref } = variant;
      await this.processReferralProductVariant(pageID, audienceID, psid, ref, subscriptionID);

      return true;
    } catch (error) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
      return false;
    }
  }

  async processReferralProductVariant(page_id: number, audienceID: number, psid: string, ref: string, subscriptionID: string): Promise<boolean> {
    try {
      await this.productWebhookService.handleProductVariantRichMenuFromWebhook(page_id, psid, ref, audienceID, subscriptionID);

      return true;
    } catch (error) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(new FacebookReferralProductHandlerError(error));
      return false;
    }
  }
}
