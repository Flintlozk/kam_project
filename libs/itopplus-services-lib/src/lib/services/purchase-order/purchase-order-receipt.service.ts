import { isEmpty } from '@reactor-room/itopplus-back-end-helpers';
import { CustomerAddress, EnumPaymentName, PayloadOption, PaymentDetail, IFacebookPipelineModel } from '@reactor-room/itopplus-model-lib';
import { getShopSettingByID } from '../../data';
import { getCustomerShippingAddressByOrder } from '../../data/customer';
import { getPaymentDetail, listPayloadPayment } from '../../data/payment';
import { getCustomerAudienceByID, getPurchasingOrderById, getPurchasingOrderItems } from '../../data/purchase-order';
import { getLogisticByID } from '../../data/settings';
import { hardcodeTransformCurrencyType } from '../../domains';
import { PlusmarService } from '../plusmarservice.class';

export class PurchaseOrderReceiptService {
  async getReceiptDeatil(pageID: number, pipeline: IFacebookPipelineModel, audienceID: number): Promise<PayloadOption> {
    const order = await getPurchasingOrderById(PlusmarService.readerClient, pageID, pipeline.order_id);
    const { id: orderId, flat_rate, delivery_fee: flat_fee, tax, tax_included, create_unixtime, update_unixtime, payment_id, logistic_id } = order;

    const productItems = await getPurchasingOrderItems(PlusmarService.readerClient, pageID, audienceID, pipeline.order_id);
    const shop = await getShopSettingByID(PlusmarService.readerClient, pageID);
    const customer = await getCustomerAudienceByID(PlusmarService.readerClient, audienceID, pageID);
    const shippingAddress = await getCustomerShippingAddressByOrder(PlusmarService.readerClient, customer.id, pipeline.page_id, pipeline.order_id);

    let customerDetail = null;
    if (!isEmpty(shippingAddress)) {
      customerDetail = {
        name: shippingAddress[0].name,
        phone_number: shippingAddress[0].phone_number,
        location: shippingAddress[0].location,
      } as CustomerAddress;
    } else {
      customerDetail = { name: customer.name, phone_number: customer.phone_number, location: customer.location } as CustomerAddress;
    }

    let paidWith = '-';
    let payments = [];
    let shipping;

    if (flat_rate) payments = (await listPayloadPayment(PlusmarService.readerClient, pageID)) as PaymentDetail[];

    if (payment_id !== null) {
      const paymentDetail = await getPaymentDetail(PlusmarService.readerClient, pageID, payment_id);
      if (!isEmpty(paymentDetail)) {
        paidWith = EnumPaymentName[paymentDetail[0].type];
      }
    }

    if (logistic_id !== null) {
      const logistic = await getLogisticByID(PlusmarService.readerClient, logistic_id, pageID);

      if (logistic) {
        const { id, name, delivery_type, delivery_fee, fee_type } = logistic;
        shipping = {
          id,
          name,
          type: delivery_type,
          flatRate: fee_type === 'FLAT_RATE', // else will return false
          deliveryFee: delivery_fee,
        };
      }
    }

    return {
      orderId: orderId,
      product: productItems,
      payment: payments,
      flatRate: flat_rate,
      flatPrice: flat_fee,
      paidWith: paidWith,
      tax: tax_included ? tax : 0,
      taxIncluded: tax_included,
      createdAt: create_unixtime,
      updatedAt: update_unixtime,
      shopDetail: { name: shop.page_name, currency: hardcodeTransformCurrencyType(shop.currency) },
      customerDetail: customerDetail,
      shipping: shipping,
    } as PayloadOption;
  }
}
