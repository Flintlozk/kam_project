import { EnumPurchaseOrderError } from '@reactor-room/itopplus-model-lib';
import { calculateThaipostShippingPrice, checkDestinationMethod } from './calculate-shipping-price.domain';

const chart = {
  inSource: {
    '250': 36,
    '500': 40,
    '1000': 51,
    '2000': 62,
    '3500': 72,
    '5000': 85,
    '7500': 104,
    '10000': 115,
    '15000': 165,
    '20000': 210,
  },
  outSource: {
    '250': 42,
    '500': 50,
    '1000': 61,
    '2000': 71,
    '3500': 82,
    '5000': 95,
    '7500': 110,
    '10000': 210,
    '15000': 225,
    '20000': 235,
  },
  default: {
    '250': 42,
    '500': 52,
    '1000': 67,
    '2000': 97,
    '3500': 142,
    '5000': 172,
    '7500': 272,
    '10000': 372,
    '15000': 537,
    '20000': 612,
  },
};

describe('calculateThaipostShippingPrice return insoruce price', () => {
  test('range 250', () => {
    const inSource = true;
    const result = calculateThaipostShippingPrice(inSource, 0.1, chart);
    expect(result).toEqual({ range: 250, price: 36 });
  });
  test('range 500', () => {
    const inSource = true;
    const result = calculateThaipostShippingPrice(inSource, 0.5, chart);
    expect(result).toEqual({ range: 500, price: 40 });
  });
  test('range 1000', () => {
    const inSource = true;
    const result = calculateThaipostShippingPrice(inSource, 1, chart);
    expect(result).toEqual({ range: 1000, price: 51 });
  });
  test('range 2000', () => {
    const inSource = true;
    const result = calculateThaipostShippingPrice(inSource, 2, chart);
    expect(result).toEqual({ range: 2000, price: 62 });
  });
  test('range 3500', () => {
    const inSource = true;
    const result = calculateThaipostShippingPrice(inSource, 3, chart);
    expect(result).toEqual({ range: 3500, price: 72 });
  });
  test('range 5000', () => {
    const inSource = true;
    const result = calculateThaipostShippingPrice(inSource, 5, chart);
    expect(result).toEqual({ range: 5000, price: 85 });
  });
  test('range 7500', () => {
    const inSource = true;
    const result = calculateThaipostShippingPrice(inSource, 7, chart);
    expect(result).toEqual({ range: 7500, price: 104 });
  });
  test('range 10000', () => {
    const inSource = true;
    const result = calculateThaipostShippingPrice(inSource, 10, chart);
    expect(result).toEqual({ range: 10000, price: 115 });
  });
  test('range 15000', () => {
    const inSource = true;
    const result = calculateThaipostShippingPrice(inSource, 15, chart);
    expect(result).toEqual({ range: 15000, price: 165 });
  });
  test('range 20000', () => {
    const inSource = true;
    const result = calculateThaipostShippingPrice(inSource, 19, chart);
    expect(result).toEqual({ range: 20000, price: 210 });
  });
  test('more than 20000', () => {
    const inSource = true;
    try {
      calculateThaipostShippingPrice(inSource, 100, chart);
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
      expect(err.message).toEqual(EnumPurchaseOrderError.WEIGHT_OUT_OF_RANGE);
    }
  });
});
describe('calculateThaipostShippingPrice return outsoruce price', () => {
  test('range 250', () => {
    const inSource = false;
    const result = calculateThaipostShippingPrice(inSource, 0.1, chart);
    expect(result).toEqual({ range: 250, price: 42 });
  });
  test('range 500', () => {
    const inSource = false;
    const result = calculateThaipostShippingPrice(inSource, 0.5, chart);
    expect(result).toEqual({ range: 500, price: 50 });
  });
  test('range 1000', () => {
    const inSource = false;
    const result = calculateThaipostShippingPrice(inSource, 1, chart);
    expect(result).toEqual({ range: 1000, price: 61 });
  });
  test('range 2000', () => {
    const inSource = false;
    const result = calculateThaipostShippingPrice(inSource, 2, chart);
    expect(result).toEqual({ range: 2000, price: 71 });
  });
  test('range 3500', () => {
    const inSource = false;
    const result = calculateThaipostShippingPrice(inSource, 3, chart);
    expect(result).toEqual({ range: 3500, price: 82 });
  });
  test('range 5000', () => {
    const inSource = false;
    const result = calculateThaipostShippingPrice(inSource, 5, chart);
    expect(result).toEqual({ range: 5000, price: 95 });
  });
  test('range 7500', () => {
    const inSource = false;
    const result = calculateThaipostShippingPrice(inSource, 7, chart);
    expect(result).toEqual({ range: 7500, price: 110 });
  });
  test('range 10000', () => {
    const inSource = false;
    const result = calculateThaipostShippingPrice(inSource, 10, chart);
    expect(result).toEqual({ range: 10000, price: 210 });
  });
  test('range 15000', () => {
    const inSource = false;
    const result = calculateThaipostShippingPrice(inSource, 15, chart);
    expect(result).toEqual({ range: 15000, price: 225 });
  });
  test('range 20000', () => {
    const inSource = false;
    const result = calculateThaipostShippingPrice(inSource, 19, chart);
    expect(result).toEqual({ range: 20000, price: 235 });
  });
  test('more than 20000', () => {
    const inSource = false;
    try {
      calculateThaipostShippingPrice(inSource, 100, chart);
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
      expect(err.message).toEqual(EnumPurchaseOrderError.WEIGHT_OUT_OF_RANGE);
    }
  });
});

describe('checkDestinationMethod in metropolis', () => {
  test('round 1', () => {
    const src = 'กรุงเทพมหานคร';
    const dest = 'สมุทรสาคร';

    const result = checkDestinationMethod(src, dest);
    expect(result).toBeTruthy();
  });
  test('round 2', () => {
    const src = 'นนทบุรี';
    const dest = 'สมุทรสาคร';

    const result = checkDestinationMethod(src, dest);
    expect(result).toBeTruthy();
  });
  test('round 3', () => {
    const src = 'กรุงเทพมหานคร';
    const dest = 'กรุงเทพมหานคร';

    const result = checkDestinationMethod(src, dest);
    expect(result).toBeTruthy();
  });
  test('round 4', () => {
    const src = 'นครปฐม';
    const dest = 'นครปฐม';

    const result = checkDestinationMethod(src, dest);
    expect(result).toBeTruthy();
  });
});
describe('checkDestinationMethod same province', () => {
  test('round 1', () => {
    const src = 'กระบี่';
    const dest = 'กระบี่';

    const result = checkDestinationMethod(src, dest);
    expect(result).toBeTruthy();
  });
  test('round 2', () => {
    const src = 'นครพนม';
    const dest = 'นครพนม';

    const result = checkDestinationMethod(src, dest);
    expect(result).toBeTruthy();
  });
  test('round 3', () => {
    const src = 'ยโสธร';
    const dest = 'ยโสธร';

    const result = checkDestinationMethod(src, dest);
    expect(result).toBeTruthy();
  });
  test('round 4', () => {
    const src = 'อุดรธานี';
    const dest = 'อุดรธานี';

    const result = checkDestinationMethod(src, dest);
    expect(result).toBeTruthy();
  });
});
describe('checkDestinationMethod different province', () => {
  test('round 1', () => {
    const src = 'กระบี่';
    const dest = 'นครพนม';

    const result = checkDestinationMethod(src, dest);
    expect(result).toBeFalsy();
  });
  test('round 2', () => {
    const src = 'นครพนม';
    const dest = 'ยโสธร';

    const result = checkDestinationMethod(src, dest);
    expect(result).toBeFalsy();
  });
  test('round 3', () => {
    const src = 'ยโสธร';
    const dest = 'อุดรธานี';

    const result = checkDestinationMethod(src, dest);
    expect(result).toBeFalsy();
  });
  test('round 4', () => {
    const src = 'กรุงเทพมหานคร';
    const dest = 'อุดรธานี';

    const result = checkDestinationMethod(src, dest);
    expect(result).toBeFalsy();
  });
});
