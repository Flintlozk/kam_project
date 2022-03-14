import { transformOrderId } from '@reactor-room/itopplus-back-end-helpers';
import {
  FacebookMessagingType,
  IFacebookMessagePayloadTypeEnum,
  IFacebookPipelineStepTemplateType,
  IFormPayloadData,
  PayloadParams,
  ReceiptDetail,
} from '@reactor-room/itopplus-model-lib';

// https://developers.facebook.com/docs/messenger-platform/reference/templates/receipt
export const receiptMessagePayload = ({ PSID }: PayloadParams, options: ReceiptDetail): IFormPayloadData => {
  // ! Current disable
  // ! Current disable
  // ! Current disable
  // ! Current disable
  // ! Current disable
  // ! Current disable
  // ! Current disable

  const { orderId, shopDetail, customerDetail, paidWith } = options;
  const { name: merchant_name, currency } = shopDetail;
  const { name: recipient_name, location } = customerDetail;

  const address = {
    street_1: '--',
    street_2: '', // optional
    city: '.',
    postal_code: '.',
    state: '.',
    country: ',',
  };
  if (location?.address) {
    address.street_1 = location.address || '.';
    address.city = location.district || '.';
    address.state = location.province || '.';
    address.postal_code = location.post_code || '.';
  }

  const summary = {
    subtotal: 0, // Optional
    shipping_cost: 0,
    total_tax: 0, // Optional
    total_cost: 0,
  };

  const products = summarizeProductAndPrice(summary, options);
  const payment_method = paidWith;
  const promotion = [
    // TODO In the futre: Promotion add here
    // { name: 'New Customer Discount', amount: 20 },
  ];

  return {
    recipient: { id: PSID },
    message: {
      attachment: {
        type: IFacebookMessagePayloadTypeEnum.TEMPLATE,
        payload: {
          template_type: IFacebookPipelineStepTemplateType.RECEIPT,
          order_number: transformOrderId(orderId),
          recipient_name: recipient_name,
          merchant_name: merchant_name,
          elements: products,
          adjustments: promotion,
          address: address,
          summary: summary,
          currency: currency, // NOTE : Only changes symbol not change price
          payment_method: payment_method,
          order_url: 'http://petersapparel.parseapp.com/order?order_id=123456',
          timestamp: new Date(options.createdAt).getTime(),
        },
      },
    },
    messaging_type: FacebookMessagingType.RESPONSE,
  };
};

export const summarizeProductAndPrice = (summary, options) => {
  // const { flatPrice, flatRate, shipping } = options;
  // ! Current disable
  // TODO : Implement logistic system

  // if (flatRate) {
  //   summary.shipping_cost = flatPrice;
  // } else {
  //   if (shipping && shipping.flatRate) summary.shipping_cost = shipping.deliveryFee;
  //   else summary.shipping_cost = 0;
  // }

  const products = options?.product.map((item) => {
    const image = item?.images?.length > 0 ? item.images[0].mediaLink : null;
    summary.subtotal += Number(item.quantity) * Number(item.unitPrice);
    return {
      title: item.productName,
      subtitle: item.attributes,
      quantity: Number(item.quantity),
      price: Number(item.unitPrice),
      currency: 'THB',
      image_url: image,
    };
  });

  summary.total_cost = Number(summary.subtotal);

  if (options.taxIncluded) {
    summary.total_tax = ((Number(options.tax) / 100) * summary.total_cost).toFixed(2);
    summary.total_cost += Number(summary.total_tax);
  }

  summary.total_cost = Number(summary.total_cost + Number(summary.shipping_cost)).toFixed(2);

  return products;
};
