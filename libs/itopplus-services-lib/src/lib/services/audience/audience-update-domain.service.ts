import { getUTCMongo, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import {
  AudienceContactActionMethod,
  AudienceDomainType,
  AudienceViewType,
  EnumPurchaseOrderStatus,
  IAudience,
  ICustomerTemp,
  ILogInput,
  IPayload,
  LogAction,
  LogType,
} from '@reactor-room/itopplus-model-lib';
import { getAudienceByCustomerID, getCustomerByaudienceID, getSubscriptionByPageID, updateAudienceDomainStatusByID, updateCustomerUpdatedAt } from '../../data';
import { SubscriptionError } from '../../errors';
import { AudienceStepService } from '../audience-step';
import { LogService } from '../log/log.service';
import { PlusmarService } from '../plusmarservice.class';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { AudienceContactService } from './audience-contact.service';

export const exampleTest = (data) => {
  return JSON.stringify(data);
};
export class AudienceUpdateDomainService {
  public PurchaseOrderService: PurchaseOrderService;
  private audienceStepService: AudienceStepService;
  private audienceContactService: AudienceContactService;
  public LogService: LogService;

  constructor() {
    this.PurchaseOrderService = new PurchaseOrderService();
    this.audienceContactService = new AudienceContactService();
    this.audienceStepService = new AudienceStepService();
    this.LogService = new LogService();
  }

  changeStatusLog = async (
    audienceID: number,
    pageID: number,
    description: string,
    user_name: string,
    user_id: number,
    subject: string,
    type: LogType,
    action: LogAction = 'Update',
  ): Promise<void> => {
    // const { pageID, userID, name } = payload;
    await this.LogService.addLog(
      {
        user_id,
        type,
        action,
        description,
        subject,
        audience_id: audienceID,
        audience_name: subject,
        user_name,
        created_at: getUTCMongo(),
      } as ILogInput,
      pageID,
    );
  };

  async moveAudienceDomain(audienceID: number, { pageID, name: AdminName, userID: AdminID }: IPayload, domain: AudienceDomainType): Promise<IAudience> {
    let customer = {} as ICustomerTemp;
    customer = await getCustomerByaudienceID(PlusmarService.readerClient, audienceID, pageID);

    if (customer) {
      const audience = await getAudienceByCustomerID(PlusmarService.readerClient, customer.id, pageID);
      if (audience) {
        switch (domain) {
          case AudienceDomainType.CUSTOMER: {
            const Client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

            await this.changeStatusLog(audienceID, pageID, `${domain.toUpperCase()}_TO_CUSTOMER`, AdminName, Number(AdminID), customer.name, 'Change status');
            const subscription = await getSubscriptionByPageID(PlusmarService.readerClient, pageID);
            if (!subscription) throw new SubscriptionError('AUDIENCE_SUBSCRIPTION_NOT_FOUND');
            // Note: create order of customer in [PG: purchasing_orders, MONGO: message_pipelines]
            await this.PurchaseOrderService.createCustomerPipeline(Client, pageID, audienceID);

            // Move audience's domain to CUSTOMER and set status to FOLLOW
            const updatedAudience = await updateAudienceDomainStatusByID(Client, domain, EnumPurchaseOrderStatus.FOLLOW, pageID, audience.id);
            await updateCustomerUpdatedAt(pageID, +updatedAudience.customer_id, Client);
            await PostgresHelper.execBatchCommitTransaction(Client);

            await this.audienceContactService.publishOnContactUpdateSubscription(AudienceViewType.FOLLOW, pageID, {
              audienceID: audienceID,
              customerID: audience.customer_id,
              method: AudienceContactActionMethod.MOVE_TO_ORDER,
            });

            await this.audienceStepService.logAudienceHistory({ pageID, userID: +AdminID, audienceID: audience?.id, currentAudience: audience, updatedAudience });
            break;
          }
        }
        return audience;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
}
