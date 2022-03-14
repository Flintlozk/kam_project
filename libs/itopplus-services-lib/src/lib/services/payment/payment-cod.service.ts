import { EnumPaymentType, CashOnDeliveryDetail, IPayload } from '@reactor-room/itopplus-model-lib';
import { findPayment, insertPaymentTypeCOD, updatePaymentTypeCOD } from '../../data/payment';
import { isEmpty } from '@reactor-room/itopplus-back-end-helpers';

import { PlusmarService } from '../plusmarservice.class';

export class PaymentCashOnDeliveryService {
  updateCOD = async (payload: IPayload, codDetail: CashOnDeliveryDetail): Promise<void> => {
    const pageId = payload.pageID;
    const type = EnumPaymentType.CASH_ON_DELIVERY;
    const paymentObject = await findPayment(PlusmarService.readerClient, pageId, type);

    if (!isEmpty(paymentObject)) {
      await updatePaymentTypeCOD(PlusmarService.writerClient, pageId, type, codDetail);
    } else {
      await insertPaymentTypeCOD(PlusmarService.writerClient, pageId, type, codDetail);
    }
  };
}
