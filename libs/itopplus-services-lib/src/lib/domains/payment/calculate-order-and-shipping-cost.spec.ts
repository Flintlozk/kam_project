import { ReceiptDetail } from '@reactor-room/itopplus-model-lib';
import { calculateOrderAndShippingCost } from '../../domains/payment/calculate-order-and-shipping-cost';

describe('calculateOrderAndShippingCost()', () => {
  test('calculateOrderAndShippingCost with flate rate', () => {
    const receipt = {
      flatPrice: 100,
      flatRate: true,
      tax: 7,
      taxIncluded: false,
      shipping: {
        deliveryFee: 200,
      },
    } as ReceiptDetail;

    expect(calculateOrderAndShippingCost(receipt, 200)).toEqual(300);
  });

  test('calculateOrderAndShippingCost with flate rate and tax', () => {
    const receipt = {
      flatPrice: 100,
      flatRate: true,
      tax: 7,
      taxIncluded: true,
      shipping: {
        deliveryFee: 200,
      },
    } as ReceiptDetail;

    expect(calculateOrderAndShippingCost(receipt, 200)).toEqual(314);
  });

  test('calculateOrderAndShippingCost with shipping rate', () => {
    const receipt = {
      flatPrice: 100,
      flatRate: false,
      tax: 7,
      taxIncluded: false,
      shipping: {
        flatRate: true,
        deliveryFee: 200,
      },
    } as ReceiptDetail;

    expect(calculateOrderAndShippingCost(receipt, 200)).toEqual(400);
  });

  test('calculateOrderAndShippingCost with shipping rate and tax', () => {
    const receipt = {
      flatPrice: 100,
      flatRate: false,
      tax: 7,
      taxIncluded: true,
      shipping: {
        flatRate: true,
        deliveryFee: 200,
      },
    } as ReceiptDetail;

    expect(calculateOrderAndShippingCost(receipt, 200)).toEqual(414);
  });

  test('calculateOrderAndShippingCost with no shipping rate and flat rate', () => {
    const receipt = {
      flatPrice: 100,
      flatRate: false,
      tax: 7,
      taxIncluded: false,
      shipping: {
        flatRate: false,
        deliveryFee: 200,
      },
    } as ReceiptDetail;

    expect(calculateOrderAndShippingCost(receipt, 200)).toEqual(200);
  });

  test('calculateOrderAndShippingCost with no shipping rate and flat rate with tax', () => {
    const receipt = {
      flatPrice: 100,
      flatRate: false,
      tax: 7,
      taxIncluded: true,
      shipping: {
        flatRate: false,
        deliveryFee: 200,
      },
    } as ReceiptDetail;

    expect(calculateOrderAndShippingCost(receipt, 200)).toEqual(214);
  });
});
