import { isNotEmptyValue } from '@reactor-room/itopplus-back-end-helpers';
import { reportAllType, TrackingTypeEnum, DeliveryType } from '@reactor-room/itopplus-model-lib';
export const splitTypeLogisticByName = (logisticType): reportAllType => {
  const objReport2: reportAllType = {
    thaipost_maunal: [],
    thaipost_dropOff: [],
    thaipost_book: [],
    jandt_maunal: [],
    jandt_dropOff: [],
    jandt_cod: [],
    flash: [],
  };
  if (isNotEmptyValue(logisticType) && logisticType.length > 0) {
    for (let i = 0; i < logisticType.length; i++) {
      const currentLogisticType = logisticType[i];
      switch (currentLogisticType.delivery_type) {
        case DeliveryType.THAIPOST:
        case DeliveryType.THAIPOST_EMS:
          if (currentLogisticType.tracking_type === TrackingTypeEnum.MANUAL || currentLogisticType.tracking_type === undefined) {
            objReport2.thaipost_maunal.push(currentLogisticType.uuid);
          } else if (currentLogisticType.tracking_type === TrackingTypeEnum.DROP_OFF) {
            objReport2.thaipost_dropOff.push(currentLogisticType.uuid);
          } else if (currentLogisticType.tracking_type === TrackingTypeEnum.BOOK) {
            objReport2.thaipost_book.push(currentLogisticType.uuid);
          }
          break;
        case DeliveryType.FLASH:
          objReport2.flash.push(currentLogisticType.uuid);
          break;
        case DeliveryType.JANDT:
        case DeliveryType.JANDT_PURCHASE_ORDER:
          if (currentLogisticType.tracking_type === TrackingTypeEnum.MANUAL || (currentLogisticType.tracking_type === undefined && currentLogisticType.cod_status === false)) {
            objReport2.jandt_maunal.push(currentLogisticType.uuid);
          } else if (currentLogisticType.tracking_type === TrackingTypeEnum.DROP_OFF && currentLogisticType.cod_status === false) {
            objReport2.jandt_dropOff.push(currentLogisticType.uuid);
          } else if (currentLogisticType.cod_status === true) {
            objReport2.jandt_cod.push(currentLogisticType.uuid);
          }
          break;
      }
    }
  }
  return objReport2;
};
