import { IOmiseChargeDetail } from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { checkOrigin } from '../../domains';
import { PipelineOnHandlePostbackMessagesError } from '../../errors';
import { PlusmarService } from '../plusmarservice.class';
import { PurchaseOrderService } from './purchase-order.service';
import { OmiseConfirmPaymentService } from './confirm-payment/omise-confirm-payment.service';
import { EnumGenericRecursiveStatus } from '@reactor-room/model-lib';
import { getRedisOnRecursive, isAllowCaptureException, setRedisOnRecursive } from '@reactor-room/itopplus-back-end-helpers';

export class PurchaseOrderOmisePostbackMessageService {
  public purchaseOrderService: PurchaseOrderService;
  public omiseConfirmPaymentService: OmiseConfirmPaymentService;

  constructor() {
    this.omiseConfirmPaymentService = new OmiseConfirmPaymentService();
  }

  handlePostbackMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      checkOrigin(PlusmarService.environment.backendUrl, req.headers as IncomingHttpHeaders);
      const omiseResponse = new Object(req.body.data) as IOmiseChargeDetail;

      switch (omiseResponse.status) {
        case 'pending': {
          // Note : Only Internet Banking & Promptpay
          const paymentRedis = await getRedisOnRecursive(PlusmarService.redisClient, omiseResponse.metadata.poID.toString());
          setRedisOnRecursive(PlusmarService.redisClient, omiseResponse.metadata.poID.toString(), {
            ...paymentRedis,
            messageStatus: EnumGenericRecursiveStatus.PENDING,
          });
          break;
        }
        case 'closed':
          console.log('REFUDNED');
          break;
        default:
          await this.omiseConfirmPaymentService.onCompleteOmisePayment(omiseResponse);
          break;
      }

      res.sendStatus(200);
    } catch (err) {
      console.log('-< err >- ', err);
      const error = new PipelineOnHandlePostbackMessagesError(err);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
      throw error;
    }
  };
}
