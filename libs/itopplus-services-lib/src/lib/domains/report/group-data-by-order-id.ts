import { isNotEmptyValue } from '@reactor-room/itopplus-back-end-helpers';
import { flashReportReponse, groupPurchaseByInOBJ, ReportDataResponse } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { getVariantsOfProductByVariantID } from '../../data/product/product.data';
import { getSortCodeAndDstStoreNameByPurchasingId } from '../../data/reports/get-data-report-by-purchasing-order-id';
import { checkEmptyValueAndParseToString } from './check-empty-value';
import { checkFormatOrderID } from './check-format-orderid';
import { createPrintTimeZone, splitSortCode } from './create-obj-for-flash';
import { checkOrderDate } from './createorderDate';
import { formatPhoneNumber } from './format-phone-number';
import { isEventNumber } from './is-event-number';
// import { DeliveryType, TrackingTypeEnum } from '@reactor-room/itopplus-model-lib';
export const groupDataByPurchaseID = async (data: ReportDataResponse[], connect: Pool): Promise<groupPurchaseByInOBJ[]> => {
  const groupDetail = [];
  if (isNotEmptyValue(data) && data.length > 0) {
    const groups = {};
    const product = {};
    for (let i = 0; i < data.length; i++) {
      const purchaseID = data[i].purchase_order_id;
      const pageID = data[i].page_id;
      const productID = data[i].product_id;
      const product_variant_id = data[i].product_variant_id;
      const customerName = `${data[i].first_name} ${data[i].last_name}`;
      const customerPhone = formatPhoneNumber(data[i].phone_number);
      const customerAddress = `${data[i].location.address} ${data[i].location.district} ${data[i].location.province} ${data[i].location.post_code}`;
      const tracking_no = data[i].tracking_no;
      let post_code = ['', '', '', '', ''];
      const tracking_type = data[i].tracking_type;
      const sortCodeAndDstStoreName = await getSortCodeAndDstStoreNameByPurchasingId(connect, data[i].purchase_order_id);
      let dstStoreName = '';
      let sortLineCode = '';
      let sortCode = {
        sortCode1: '',
        sortCode2: '',
        sortCode3: '',
      };
      let sortingCodeJandT = '';
      if (isNotEmptyValue(sortCodeAndDstStoreName) && sortCodeAndDstStoreName.length > 0) {
        dstStoreName = setDstStoreName(sortCodeAndDstStoreName[0]);
        sortLineCode = setSortLineCode(sortCodeAndDstStoreName[0]);
        sortCode = splitSortCode(setSortCode(sortCodeAndDstStoreName[0]));
        sortingCodeJandT = setSortingCodeJandT(sortCodeAndDstStoreName[0]);
      }
      if (isNotEmptyValue(data[i].location.post_code)) {
        post_code = data[i].location.post_code.split('');
      }
      if (!groups[purchaseID]) {
        groups[purchaseID] = [];
        product[purchaseID] = [];
        groups[purchaseID].customerName = `${data[i].first_name} ${data[i].last_name}`;
        groups[purchaseID].customerLastName = data[i].last_name;
        groups[purchaseID].customerPhone = formatPhoneNumber(data[i].phone_number);
        groups[purchaseID].customerAddress = `${data[i].location.address} ${data[i].location.district} ${data[i].location.province} ${data[i].location.post_code}`;
        groups[purchaseID].trackingNo = tracking_no;
        groups[purchaseID].createDate = checkOrderDate(checkEmptyValueAndParseToString(data[i].createorderdate));
        groups[purchaseID].shippingDate = checkOrderDate(checkEmptyValueAndParseToString(data[i].shipping_date));
        groups[purchaseID].shippingName = data[i].name;
        groups[purchaseID].shippingPrice = data[i].delivery_fee;
        groups[purchaseID].orderID = checkFormatOrderID(data[i].purchase_order_id);
        groups[purchaseID].vat = data[i].tax;
        groups[purchaseID].discount = 0;
        groups[purchaseID].tracking_type = tracking_type;
        groups[purchaseID].productList = [];
        // groups[purchaseID].typeOfLogistic = '00000000';
        groups[purchaseID].customerData = [
          {
            detail: `${customerName} \r\n${customerAddress} \r\n เบอร์โทร ${customerPhone}
            `,
            tracking_type: tracking_type,
            tracking_no: tracking_no,
            post_code1: post_code[0],
            post_code2: post_code[1],
            post_code3: post_code[2],
            post_code4: post_code[3],
            post_code5: post_code[4],
            sortLineCode: sortLineCode,
            customerName: customerName,
            customerAddress: customerAddress,
            customerPhone: customerPhone,
            customerName_Phone: `${customerName} ${customerPhone}`,
          },
        ];
        groups[purchaseID].priceDetail = [
          {
            discount: 0,
            priceAfterDiscount: '',
            priceBeforeIncludeVat: '',
            shipping: '',
            vatValue: '',
            vat: '',
            total: '',
            totalString: '',
          },
        ];
        groups[purchaseID].sortLineCode = sortLineCode;
        groups[purchaseID].dstStoreName = dstStoreName;
        groups[purchaseID].sortCode = sortCode;
        groups[purchaseID].sortingCodeJandT = sortingCodeJandT;
        groups[purchaseID].printTime = createPrintTimeZone();
      }
      const getVariantDetail = await getVariantsOfProductByVariantID(connect, pageID, productID, product_variant_id);
      let productNameWithDetail = '';
      if (isNotEmptyValue(getVariantDetail) && getVariantDetail.length > 0) {
        productNameWithDetail = getVariantDetail[0].variantAttributes;
      }
      const productTotal = parseFloat(data[i].item_price) * data[i].item_quantity;
      const productDetailList = {
        proOrder: i + 1,
        proName: data[i].proname,
        proPrice: data[i].item_price,
        proQty: data[i].item_quantity,
        proTotal: productTotal,
        proDuctAttribute: productNameWithDetail,
        isEvent: isEventNumber(i + 1),
      };
      groups[purchaseID].productList.push(productDetailList);
    }
    for (const valueInObj in groups) {
      groupDetail.push({
        customerName: groups[valueInObj].customerName,
        customerLastName: groups[valueInObj].customerLastName,
        customerPhone: groups[valueInObj].customerPhone,
        customerAddress: groups[valueInObj].customerAddress,
        trackingNo: groups[valueInObj].trackingNo,
        createDate: groups[valueInObj].createDate,
        orderID: groups[valueInObj].orderID,
        shippingDate: groups[valueInObj].shippingDate,
        shippingName: groups[valueInObj].shippingName,
        shippingPrice: groups[valueInObj].shippingPrice,
        vat: groups[valueInObj].vat,
        discount: groups[valueInObj].discount,
        productList: groups[valueInObj].productList,
        priceDetail: groups[valueInObj].priceDetail,
        customerData: groups[valueInObj].customerData,
        sortLineCode: groups[valueInObj].sortLineCode,
        dstStoreName: groups[valueInObj].dstStoreName,
        sortCode: groups[valueInObj].sortCode,
        sortingCodeJandT: groups[valueInObj].sortingCodeJandT,
        printTime: groups[valueInObj].printTime,
        // typeOfLogistic: groups[valueInObj].typeOfLogistic,
      });
    }
  }
  return groupDetail;
};
export const setSortingCodeJandT = (sortCodeDetail: flashReportReponse): string => {
  let result = '';
  if (isNotEmptyValue(sortCodeDetail) && isNotEmptyValue(sortCodeDetail.payload) && isNotEmptyValue(sortCodeDetail.payload.responseitems)) {
    if (sortCodeDetail.payload.responseitems.length > 0) {
      result = sortCodeDetail.payload.responseitems[0].sortingcode;
    }
  }
  return result;
};
export const setDstStoreName = (sortCodeDetail: flashReportReponse): string => {
  let result = '';
  if (isNotEmptyValue(sortCodeDetail) && isNotEmptyValue(sortCodeDetail.payload)) {
    if (isNotEmptyValue(sortCodeDetail.payload.data) && isNotEmptyValue(sortCodeDetail.payload.data.dstStoreName)) {
      result = sortCodeDetail.payload.data.dstStoreName;
    }
  }
  return result;
};
export const setSortLineCode = (sortCodeDetail: flashReportReponse): string => {
  let result = '';
  if (isNotEmptyValue(sortCodeDetail) && isNotEmptyValue(sortCodeDetail.payload) && isNotEmptyValue(sortCodeDetail.payload.data)) {
    result = sortCodeDetail.payload.data.sortingLineCode;
  }
  return result;
};
export const setSortCode = (sortCodeDetail: flashReportReponse): string => {
  let result = '';
  if (isNotEmptyValue(sortCodeDetail) && isNotEmptyValue(sortCodeDetail.payload) && isNotEmptyValue(sortCodeDetail.payload.data)) {
    result = sortCodeDetail.payload.data.sortCode;
  }
  return result;
};
// export const checkTypeOfReport = (trackingType: string, deliveryType: string, codStatus: boolean): TypeReport => {
//   switch (deliveryType) {
//     case DeliveryType.THAIPOST:
//     case DeliveryType.THAIPOST_EMS:
//       if (trackingType === TrackingTypeEnum.MANUAL) {
//         return TypeReport.THAIPOST_MAUNAL;
//       }
//       if (trackingType === TrackingTypeEnum.DROP_OFF) {
//         return TypeReport.THAIPOST_DROPOFF;
//       }
//       if (trackingType === TrackingTypeEnum.BOOK) {
//         return TypeReport.THAIPOST_BOOK;
//       }
//       break;
//     case DeliveryType.JANDT:
//     case DeliveryType.JANDT_PURCHASE_ORDER:
//       if (codStatus === true) {
//         return TypeReport.JANDTCOD;
//       }
//       if (trackingType === TrackingTypeEnum.MANUAL) {
//         return TypeReport.JANDT_MANUAL;
//       }
//       if (trackingType === TrackingTypeEnum.DROP_OFF) {
//         return TypeReport.JANDTCOD;
//       }
//       break;
//     case DeliveryType.FLASH:
//       return TypeReport.FLASH;
//     default:
//       return TypeReport.THAIPOST_MAUNAL;
//   }
// };
