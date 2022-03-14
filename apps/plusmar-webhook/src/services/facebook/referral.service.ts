import { AudiencePlatformType } from '@reactor-room/model-lib';
import { AudienceDomainStatus, AudienceDomainType, ILeadsFormReferral, IPages } from '@reactor-room/itopplus-model-lib';
import { LeadsService } from '@reactor-room/itopplus-services-lib';
import { isEmpty } from 'lodash';
import { WebHookHelpers } from '../../domains/webhook.domain';
import { FacebookReferralHandlerError } from '../../errors';
import { SharedService } from '../shared/shared.service';

export class ReferralHandler {
  private webhookHelper = new WebHookHelpers();
  private leadService = new LeadsService();
  private sharedService = new SharedService();
  public start = async (webhook): Promise<boolean> => {
    // ? Note : Incoming as Refarral can be send message back to customer with RESPONSE tag (fn sendMessagePayload)
    // ? Note : Need to handle another status as .REFERRAL
    // TODO : Automate LEAD From indexOf __l to create Audience lead type
    // ! Note : Now any incoming will only create a customer
    try {
      const notAllowToCreateAudience = false;
      const handleDefault = await this.sharedService.start(
        webhook,
        AudienceDomainType.AUDIENCE,
        AudienceDomainStatus.INBOX,
        AudiencePlatformType.FACEBOOKFANPAGE,
        notAllowToCreateAudience,
      );
      if (handleDefault.isPageNotFound) {
        return false; // isPageNotFound may be this page not belong to us.
      }

      const page = handleDefault.page;
      const audience = handleDefault.audience; // === false Mean not to create Audience

      const isAudienceCreated = handleDefault.isAudienceCreated;

      // such as 'Refferal / Job (Facebook) but We need to make sure our logic is right we must not keep the data without audience.
      if (!isAudienceCreated) return false; // in case not create Audience and we ignore this message by ack()
      if (!audience) return false;

      const { ref } = this.webhookHelper.getReferralFromMessage(webhook);
      if (!ref) {
        return false;
      } else {
        return await this.create(ref, page);
      }
    } catch (err) {
      throw new FacebookReferralHandlerError(err);
    }
  };

  private create = async (ref: string, page: IPages): Promise<boolean> => {
    const formReferral: ILeadsFormReferral = await this.leadService.getReferral(ref);
    if (isEmpty(formReferral)) return false;

    const form = await this.leadService.getFormNameByID(formReferral.form_id, page.id);
    if (isEmpty(form)) return false;

    return true;
  };
}
