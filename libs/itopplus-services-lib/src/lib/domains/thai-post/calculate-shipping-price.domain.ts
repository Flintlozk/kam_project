import { EnumPurchaseOrderError, IThaiPostShippingPrice, IThaiPostShippingPriceChart } from '@reactor-room/itopplus-model-lib';

export const calculateThaipostShippingPrice = (inSource: boolean, weight: number, chart: IThaiPostShippingPriceChart): { range: number; price: number } => {
  let filterChart: IThaiPostShippingPrice;
  if (inSource) filterChart = chart.inSource;
  else filterChart = chart.outSource;

  const weightInGrams = weight * 1000;
  if (weightInGrams > 0 && weightInGrams <= 250) return { range: 250, price: filterChart['250'] };
  else if (weightInGrams > 250 && weightInGrams <= 500) return { range: 500, price: filterChart['500'] };
  else if (weightInGrams > 500 && weightInGrams <= 1000) return { range: 1000, price: filterChart['1000'] };
  else if (weightInGrams > 1000 && weightInGrams <= 2000) return { range: 2000, price: filterChart['2000'] };
  else if (weightInGrams > 2000 && weightInGrams <= 3500) return { range: 3500, price: filterChart['3500'] };
  else if (weightInGrams > 3500 && weightInGrams <= 5000) return { range: 5000, price: filterChart['5000'] };
  else if (weightInGrams > 5000 && weightInGrams <= 7500) return { range: 7500, price: filterChart['7500'] };
  else if (weightInGrams > 7500 && weightInGrams <= 10000) return { range: 10000, price: filterChart['10000'] };
  else if (weightInGrams > 10000 && weightInGrams <= 15000) return { range: 15000, price: filterChart['15000'] };
  else if (weightInGrams > 15000 && weightInGrams <= 20000) return { range: 20000, price: filterChart['20000'] };
  else throw new Error(EnumPurchaseOrderError.WEIGHT_OUT_OF_RANGE);
};

export const checkDestinationMethod = (srcProvince: string, desProvince: string): boolean => {
  const bangkokMetropolis = ['กรุงเทพมหานคร', 'นครปฐม', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'สมุทรสาคร'];
  if (bangkokMetropolis.includes(srcProvince) && bangkokMetropolis.includes(desProvince)) {
    return true;
  } else if (srcProvince === desProvince) {
    return true;
  } else {
    return false;
  }
};
