import {
  BankAccountDetail,
  EnumPaymentType,
  AddressJsonArray,
  ILogisticSelectorTemplate,
  IPipelineStep2Settings,
  PaymentDetail,
  PaypalDetail,
  PurchaseOrderModel,
  IOmiseDetail,
  IPipelineCheckoutPaypalSettings,
  IPipelineCheckoutOmiseSettings,
  IPipelineCheckout2C2PSettings,
  IPipelineOrderSettings,
  PurchaseOrderProducts,
  IPipelineStep2SettingProductList,
  CashOnDeliveryDetail,
} from '@reactor-room/itopplus-model-lib';
import { mapOmiseOption } from '../payment/omise-payment.domain';

export const checkPaypalExist = (paymentDetail: PaymentDetail[]): PaypalDetail => {
  const paypalData = paymentDetail.filter((item) => item.type === EnumPaymentType.PAYPAL);
  if (paypalData.length === 0) throw new Error('NO_PAYPAL');
  else return paypalData[0].option as PaypalDetail;
};

export const checkOmiseExist = (paymentDetail: PaymentDetail[]): IOmiseDetail => {
  const omiseData = paymentDetail.filter((item) => item.type === EnumPaymentType.OMISE);
  if (omiseData.length === 0) throw new Error('NO_OMISE');
  else {
    const omiseDetail = mapOmiseOption(omiseData[0].option, omiseData[0].option.option);
    return omiseDetail;
  }
};

export const getPayloadForCheckoutPaypal = (paymentDetail: PaymentDetail[], order: PurchaseOrderModel, logistics: ILogisticSelectorTemplate[]): IPipelineCheckoutPaypalSettings => {
  const { logistic_id, flat_rate, delivery_fee } = order;
  let enablePaypal = false;
  let paypalClientId = '';
  try {
    const paypal = checkPaypalExist(paymentDetail);

    if (paypal) {
      enablePaypal = true;
      paypalClientId = paypal.clientId;
    }
  } catch (err) {
    enablePaypal = false; // just in case
  }
  const orderObj = checkOrderDetail(order);

  if (flat_rate) {
    orderObj.shippingCost = Number(delivery_fee);
  } else if (logistic_id) {
    const logisDetail = logistics.find((item) => item.id === logistic_id);
    if (logisDetail) {
      if (logisDetail.flatRate) {
        orderObj.shippingCost = Number(logisDetail.deliveryFee);
      }
    }
  }

  const settings = {
    enablePaypal,
    /* Misc */
    currency: 'THB',
    paypalClientId,
    ...orderObj,
  };

  return settings;
};
export const getPayloadForCheckout2C2P = (order: PurchaseOrderModel, logistics: ILogisticSelectorTemplate[]): IPipelineCheckout2C2PSettings => {
  const { logistic_id, flat_rate, delivery_fee } = order;
  const orderObj = checkOrderDetail(order);

  if (flat_rate) {
    orderObj.shippingCost = Number(delivery_fee);
  } else if (logistic_id) {
    const logisDetail = logistics.find((item) => item.id === logistic_id);
    if (logisDetail) {
      if (logisDetail.flatRate) {
        orderObj.shippingCost = Number(logisDetail.deliveryFee);
      }
    }
  }

  const settings = {
    currency: 'THB',
    ...orderObj,
  };

  return settings;
};
export const getPayloadForCheckoutOmise = (paymentDetail: PaymentDetail[], order: PurchaseOrderModel, logistics: ILogisticSelectorTemplate[]): IPipelineCheckoutOmiseSettings => {
  const { logistic_id, flat_rate, delivery_fee } = order;
  let enableOmise = false;
  let omisePublicKey = '';
  let omiseOption = null;
  try {
    const omise = checkOmiseExist(paymentDetail);
    if (omise) {
      enableOmise = true;
      omisePublicKey = omise.publicKey;
      omiseOption = omise.option;
    }
  } catch (err) {
    enableOmise = false;
  }
  const orderObj = checkOrderDetail(order);

  if (flat_rate) {
    orderObj.shippingCost = Number(delivery_fee);
  } else if (logistic_id) {
    const logisDetail = logistics.find((item) => item.id === logistic_id);
    if (logisDetail) {
      if (logisDetail.flatRate) {
        orderObj.shippingCost = Number(logisDetail.deliveryFee);
      }
    }
  }

  const settings = {
    ...orderObj,
    enableOmise,
    omiseOption,
    /* Misc */
    currency: 'THB',
    omisePublicKey,
  };

  return settings;
};

export const getPayloadForStep2 = (
  payments: PaymentDetail[],
  accounts: BankAccountDetail[],
  logistics: ILogisticSelectorTemplate[],
  order: PurchaseOrderModel,
  paymentDetail: PaymentDetail[],
  addressJson: AddressJsonArray,
  products: PurchaseOrderProducts[],
): IPipelineStep2Settings => {
  const { logistic_id, bank_account_id, payment_id } = order;
  let enablePaypal = false;
  let paypalClientId = '';
  let enableOmise = false;
  let omisePublicKey = '';
  let logisticID = null;
  let paymentID = null;
  let omiseOption = null;

  try {
    const paypal = checkPaypalExist(paymentDetail);
    if (paypal) {
      enablePaypal = true;
      paypalClientId = paypal.clientId;
    }
  } catch (err) {
    enablePaypal = false; // just in case
  }

  try {
    const omise = checkOmiseExist(paymentDetail);
    if (omise) {
      enableOmise = true;
      omisePublicKey = omise.publicKey;
      omiseOption = omise.option;
    }
  } catch (err) {
    enableOmise = false;
  }

  // Before call `checkOrderDetail` must complete logistic_system first
  const orderObj = checkOrderDetail(order);
  if (logistic_id) {
    logisticID = logistic_id;
  }

  if (payment_id !== null) {
    paymentID = payment_id;
  }

  // checkCOD
  const filteredPayment = filterMinimumCOD(payments, orderObj);

  const productList: IPipelineStep2SettingProductList[] = products.map((item) => {
    return {
      unitPrice: `฿${item.unitPrice}`,
      variantId: item.variantId,
      productId: item.productId,
      quantity: item.quantity,
      productName: item.productName,
      images: item.images.map((item) => item.mediaLink),
      attributes: item.attributes,
    };
  });

  const settings = {
    /* Detail */
    aliasOrderId: order.aliasOrderId,
    // receipt,
    payments: filteredPayment.payments,
    accounts: accounts,
    logistics: logistics,
    logisticID: logisticID,
    paymentID: paymentID,
    bankAccountID: bank_account_id,
    /* Setting */
    enablePaypal: enablePaypal, // IPipelineCheckoutPaypalSettings
    enableOmise: enableOmise, // IPipelineCheckoutOmiseSettings
    ...orderObj,
    /* Misc */
    currency: 'THB',
    paypalClientId: paypalClientId,
    omisePublicKey: omisePublicKey,
    omiseOption: omiseOption,
    addressJson: addressJson,
    productList: productList,
    notMetMinimumCOD: !filteredPayment.isCODMinimum,
  };
  return settings;
};

export const filterMinimumCOD = (payments: PaymentDetail[], orderObj: IPipelineOrderSettings): { isCODMinimum: boolean; payments: PaymentDetail[] } => {
  let isCODMinimum = false;
  const filter = payments
    .map((payment) => {
      if (payment.type === EnumPaymentType.CASH_ON_DELIVERY) {
        const codOption: CashOnDeliveryDetail = payment.option;
        if (codOption === null) {
          isCODMinimum = false;
          return payment;
        }
        const minimum = +codOption.minimumValue;
        if (orderObj.totalSub >= minimum) {
          isCODMinimum = true;
          return payment;
        }
      } else {
        return payment;
      }
    })
    .filter((payment) => !!payment); // Note : filter undefined, null , 0 , false
  return {
    isCODMinimum,
    payments: filter,
  };
};

export const checkOrderDetail = (order: PurchaseOrderModel): IPipelineOrderSettings => {
  const { flat_rate: logisticSystem, delivery_fee, total_price, tax_included, tax } = order;
  const shippingCost = delivery_fee;
  let taxPrice = 0;
  const totalSub = Number(total_price);
  const totalAmount = Number(total_price);
  const taxAmount = tax;

  if (tax_included) {
    taxPrice = (Number(taxAmount) / 100) * totalSub;
  }

  return {
    aliasOrderId: order.aliasOrderId,
    taxIncluded: tax_included,
    taxPrice: taxPrice,
    taxAmount: taxAmount,
    logisticSystem: logisticSystem,
    totalSub: totalSub,
    totalAmount: totalAmount,
    shippingCost,
  };
};
