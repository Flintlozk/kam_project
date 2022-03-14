import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { EnumPaymentType, IOmiseChargeDetail } from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { getAudienceByIDOnly, getSubscriptionByPageID } from '../../../data';
import { PaymentOmiseError } from '../../../errors';
import { PaymentOmiseService, PaymentService } from '../../payment';
import { PipelineService } from '../../pipeline';
import { PlusmarService } from '../../plusmarservice.class';

export class OmiseConfirmPaymentService {
  public pipelineService: PipelineService;
  public paymentService: PaymentService;
  public paymentOmiseService: PaymentOmiseService;

  constructor() {
    this.pipelineService = new PipelineService();
    this.paymentService = new PaymentService();
    this.paymentOmiseService = new PaymentOmiseService();
  }

  async onCompleteOmisePayment(omiseResponse: IOmiseChargeDetail): Promise<void> {
    try {
      const { responseType, audienceID, psid, poID } = omiseResponse.metadata;
      const audience = await getAudienceByIDOnly(PlusmarService.readerClient, Number(audienceID));

      const isPaymentSucces = omiseResponse.paid;

      const pipeline = await this.pipelineService.getPipelineOnPostbackMessage(responseType, audience.page_id, Number(audienceID));
      const isOrderIDValid = poID === pipeline.order_id;

      if (!isOrderIDValid) {
        throw new PaymentOmiseError('ORDER_ID_NOT_VALID');
      }
      const payments = await this.paymentService.getPaymentList(audience.page_id);
      const paymentOmise = payments.find((x) => x.type === EnumPaymentType.OMISE);

      // TODO: not get from database
      const subscription = await getSubscriptionByPageID(PlusmarService.readerClient, audience.page_id);

      if (isPaymentSucces) {
        await this.paymentOmiseService.omisePaymentSuccess(omiseResponse, paymentOmise.option.OMISE, audience.page_id, subscription.id);
      } else {
        await this.paymentOmiseService.omisePaymentFail(omiseResponse, psid);
      }
    } catch (err) {
      console.log('onCompleteOmisePayment err: ', err);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(new PaymentOmiseError(err));
      throw err;
    }
  }
}
