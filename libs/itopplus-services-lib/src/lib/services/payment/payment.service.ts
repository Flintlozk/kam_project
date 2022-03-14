import { groupBy, isEmpty } from '@reactor-room/itopplus-back-end-helpers';
import {
  BankAccountDetail,
  CashOnDeliveryDetail,
  EnumPaymentType,
  IPayment,
  IPipelineOrderSettings,
  PaymentDetail,
  SettingPaymentResponse,
} from '@reactor-room/itopplus-model-lib';
import { getLogisticByID, getPurchaseOrderPipelineData, getPurchasingOrderById } from '../../data';
import {
  findPayment,
  getPaymentDetail,
  getPaymentDetailOfPage,
  insertPayment,
  listAllPayment,
  listAllPaymentWithCondition,
  listPayloadBankAccount,
  listPayloadPayment,
  togglePayment,
} from '../../data/payment';
import { checkOrderDetail } from '../../domains';
import { mapPaymentList } from '../../domains/payment/';
import { PlusmarService } from '../plusmarservice.class';

// import * as paypal from '@paypal/checkout-server-sdk';

export class PaymentService {
  async listPayloadPayment(pageID: number): Promise<PaymentDetail[]> {
    return await listPayloadPayment(PlusmarService.readerClient, pageID);
  }
  async listPayloadBankAccount(pageID: number): Promise<BankAccountDetail[]> {
    return await listPayloadBankAccount(PlusmarService.readerClient, pageID);
  }
  async getPaymentDetail(pageID: number, paymentID: number): Promise<PaymentDetail[]> {
    return await getPaymentDetail(PlusmarService.readerClient, pageID, paymentID);
  }
  async getPaymentDetailOfPage(pageID: number): Promise<PaymentDetail[]> {
    return await getPaymentDetailOfPage(PlusmarService.readerClient, pageID);
  }

  getPaymentList = async (pageID: number): Promise<IPayment[]> => {
    const list = await listAllPayment(PlusmarService.readerClient, pageID);

    if (!isEmpty(list)) {
      const group = groupBy<IPayment[]>(list, 'id');
      const result = mapPaymentList(group);
      return result;
    } else {
      return [];
    }
  };
  getPaymentListByLogistic = async (pageID: number, audienceID: number, logisticID: number): Promise<IPayment[]> => {
    const list = await listAllPaymentWithCondition(PlusmarService.readerClient, pageID);
    if (!isEmpty(list)) {
      const group = groupBy<IPayment[]>(list, 'id');
      let paymentList = mapPaymentList(group);

      if (logisticID !== 0) {
        // NOT GLOBAL Flatrate
        const logistic = await getLogisticByID(PlusmarService.readerClient, logisticID, pageID);
        if (!logistic.cod_status) {
          paymentList = paymentList.filter((item) => {
            return item.type !== EnumPaymentType.CASH_ON_DELIVERY;
          });
        }
      }

      const pipeline = await getPurchaseOrderPipelineData(PlusmarService.readerClient, pageID, audienceID);
      const order = await getPurchasingOrderById(PlusmarService.readerClient, pageID, pipeline.order_id);
      const orderObject = checkOrderDetail(order);
      const result = this.filterMinimumCOD(paymentList, orderObject);

      return result;
    } else {
      return [];
    }
  };

  filterMinimumCOD = (payments: IPayment[], orderObj: IPipelineOrderSettings): IPayment[] => {
    return payments
      .map((payment) => {
        if (payment.type === EnumPaymentType.CASH_ON_DELIVERY) {
          const codOption: CashOnDeliveryDetail = payment.option['CASH_ON_DELIVERY'];
          const minimum = +codOption.minimumValue;
          if (orderObj.totalSub >= minimum) {
            return payment;
          }
        } else {
          return payment;
        }
      })
      .filter((payment) => !!payment); // Note : filter undefined, null , 0 , false
  };

  togglePaymentByType = async (pageID: number, type: EnumPaymentType): Promise<SettingPaymentResponse> => {
    switch (type) {
      case EnumPaymentType.BANK_ACCOUNT:
        await this.togglePaymentAction(pageID, type);
        return {
          status: 200,
          message: 'OK',
        };
      case EnumPaymentType.CASH_ON_DELIVERY:
        await this.togglePaymentAction(pageID, type);
        return {
          status: 200,
          message: 'OK',
        };
      case EnumPaymentType.PAYPAL:
        await this.togglePaymentAction(pageID, type);
        return {
          status: 200,
          message: 'OK',
        };
      case EnumPaymentType.PAYMENT_2C2P:
        // await this.togglePaymentAction(pageID, type);
        // return {
        //   status: 200,
        //   message: 'OK',
        // };
        return {
          status: 500,
          message: 'NOT_SUPPORT_IN_THE_MOMENT',
        };
      case EnumPaymentType.QR_PAYMENT_KBANK:
        return {
          status: 500,
          message: 'NOT_SUPPORT_IN_THE_MOMENT',
        };
      case EnumPaymentType.PAY_SOLUTION:
        await this.togglePaymentAction(pageID, type);
        return {
          status: 500,
          message: 'NOT_SUPPORT_IN_THE_MOMENT',
        };
      case EnumPaymentType.OMISE:
        await this.togglePaymentAction(pageID, type);
        return {
          status: 200,
          message: 'OK',
        };
    }
  };

  togglePaymentAction = async (pageId: number, type: EnumPaymentType): Promise<void> => {
    const paymentObject = await findPayment(PlusmarService.readerClient, pageId, type);
    if (!isEmpty(paymentObject)) {
      const payment = paymentObject[0];
      await togglePayment(PlusmarService.writerClient, pageId, type, !payment.status);
    } else {
      await insertPayment(PlusmarService.writerClient, pageId, type);
    }
  };
}
