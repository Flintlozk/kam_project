import { ReceiptDetail } from '@reactor-room/itopplus-model-lib';

export function calculateOrderAndShippingCost(receipt: ReceiptDetail, orderPrice: number): number {
  let shippingCost = 0;
  let totalPrice = 0;

  if (receipt.flatRate) {
    shippingCost = Number(receipt.flatPrice);
  } else {
    if (receipt.shipping.flatRate) shippingCost = Number(receipt.shipping.deliveryFee);
  }

  totalPrice = orderPrice;

  if (receipt.taxIncluded) {
    totalPrice += (Number(receipt.tax) / 100) * totalPrice;
  }
  return totalPrice + shippingCost;
}
