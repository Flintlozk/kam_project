import { IOmiseCapability, IOmiseDetail, IPayment, IPaymentOmiseOption, IPaymentOption, PaymentDetail } from '@reactor-room/itopplus-model-lib';

export const mapOmiseCapability = (omiseCapability: IOmiseCapability): IPaymentOmiseOption => {
  const creditCard = omiseCapability.payment_methods.find((x) => x.name === 'card');
  const promptPay = omiseCapability.payment_methods.find((x) => x.name === 'promptpay');
  return {
    creditCard: creditCard ? true : false,
    qrCode: promptPay ? true : false,
  } as IPaymentOmiseOption;
};

export const mapOmiseOption = (omiseConfig: IOmiseDetail, test: string): IOmiseDetail => {
  const defaultOmiseOption: IPaymentOmiseOption = {
    creditCard: false,
    qrCode: false,
  };
  const omiseOption = test ? (JSON.parse(test) as IPaymentOmiseOption) : defaultOmiseOption;
  return {
    ...omiseConfig,
    option: omiseOption,
  };
};
