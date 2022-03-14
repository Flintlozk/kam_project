import { isNotEmptyValue } from '@reactor-room/itopplus-back-end-helpers';
import { textThaiBaht } from './thai-bath';
import { groupPurchaseByInOBJ } from '@reactor-room/itopplus-model-lib';
import { changeFormatValue } from './change-format-value';
export const calculatePriceDetail = (data: groupPurchaseByInOBJ[]): groupPurchaseByInOBJ[] => {
  if (isNotEmptyValue(data) && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      let totalPriceProduct = 0;
      let priceBeforeIncludeVat = 0;
      let totalString = '';
      let vat = 0;
      let shippingPrice = 0;
      let priceAfterDiscount = 0;
      let totalPrice = 0;
      if (isNotEmptyValue(data[i].vat)) {
        vat = parseFloat(data[i].vat);
      } else {
        data[i].vat = '';
      }
      if (isNotEmptyValue(data[i].shippingPrice)) {
        shippingPrice = parseFloat(data[i].shippingPrice);
      }
      totalPriceProduct = calculatePriceProduct(totalPriceProduct, data[i].productList);
      priceAfterDiscount = totalPriceProduct - data[i].discount;
      priceBeforeIncludeVat = priceAfterDiscount + shippingPrice;
      vat = (priceAfterDiscount * vat) / 100;
      totalPrice = priceBeforeIncludeVat + vat;
      totalString = textThaiBaht(totalPrice);
      const discountString = changeFormatValue(data[i].discount);
      const priceAfterDiscountString = changeFormatValue(priceAfterDiscount);
      const shippingString = changeFormatValue(shippingPrice);
      const priceBeforeIncludeVatString = changeFormatValue(priceBeforeIncludeVat);
      const totalPriceValueString = changeFormatValue(totalPrice);
      const totalPriceText = totalString;
      const vatString = changeFormatValue(vat);
      data[i].priceDetail[0].discount = discountString;
      data[i].priceDetail[0].priceAfterDiscount = priceAfterDiscountString;
      data[i].priceDetail[0].shipping = shippingString;
      data[i].priceDetail[0].priceBeforeIncludeVat = priceBeforeIncludeVatString;
      data[i].priceDetail[0].total = totalPriceValueString;
      data[i].priceDetail[0].totalString = totalPriceText;
      data[i].priceDetail[0].vatValue = `${data[i].vat.toString()} %`;
      data[i].priceDetail[0].vat = vatString;
      data[i].cod_value = `cod:${totalPrice}`;
    }
  }
  return data;
};
export const calculatePriceProduct = (totalprice, productList) => {
  for (let x = 0; x < productList.length; x++) {
    totalprice += productList[x].proTotal;
  }
  return totalprice;
};
