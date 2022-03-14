import {
  EnumLogisticDeliveryProviderType,
  EnumTrackingType,
  IFlashExpressCreateOrderResponse,
  IFlashExpressCreateOrderResponseData,
  IJAndTExpressResponseData,
  IPaperParam,
  IPaperRender,
  IPurchaseOrderItemListPaperModel,
  IPurchaseOrderPaperModel,
  PaperSize,
} from '@reactor-room/itopplus-model-lib';

export const getReceiptPayload = ({ paperSize }: IPaperParam, payload: IPurchaseOrderPaperModel): IPaperRender => {
  switch (paperSize) {
    case PaperSize.SIZE_100x150:
      return { viewPath: 'reports/receipts/' + paperSize + '.ejs', payload } as IPaperRender;
    case PaperSize.SIZE_A4:
      return { viewPath: 'reports/receipts/' + paperSize + '.ejs', payload } as IPaperRender;
  }
};

export const getLabelPayload = (params: IPaperParam, payload: IPurchaseOrderPaperModel, products: IPurchaseOrderItemListPaperModel[]): IPaperRender => {
  const { paperSize } = params;
  const { deliveryType, trackingType } = payload;

  console.log('GET ::', params.orderUUID, paperSize, deliveryType, trackingType); // intent to leave this

  switch (deliveryType) {
    case EnumLogisticDeliveryProviderType.THAILAND_POST: {
      return getLabelPayloadThailandPost(params, payload, products);
    }
    case EnumLogisticDeliveryProviderType.FLASH_EXPRESS: {
      const flashExpressResponseData = payload.trackingPayload as IFlashExpressCreateOrderResponse;
      return getLabelPayloadFlashExpress(params, payload, flashExpressResponseData, products);
    }
    case EnumLogisticDeliveryProviderType.J_AND_T: {
      const JTExpressResponseData = payload.trackingPayload as IJAndTExpressResponseData;
      return getLabelPayloadJandTExpress(params, payload, JTExpressResponseData, products);
    }
    default:
      return getLabelPayloadDefault(params, payload, products);
  }
};

const thaipostExpandTrack = (trackNo: string): string => {
  return trackNo.substring(0, 2) + ' ' + trackNo.substring(2, 6) + ' ' + trackNo.substring(6, 10) + ' ' + trackNo.substring(10, 11) + ' ' + trackNo.substring(11, 13);
};

export const getLabelPayloadThailandPost = (params: IPaperParam, payload: IPurchaseOrderPaperModel, products: IPurchaseOrderItemListPaperModel[]): IPaperRender => {
  const { paperSize } = params;
  const { trackingType, codEnabled } = payload;

  if (payload.trackingNo !== null) payload.expandedTrackingNo = thaipostExpandTrack(payload.trackingNo);

  switch (trackingType) {
    case EnumTrackingType.DROP_OFF: {
      switch (paperSize) {
        case PaperSize.SIZE_100x150:
          return { viewPath: codEnabled ? 'reports/labels/thaipost/100x150_dropoff_cod.ejs' : 'reports/labels/thaipost/100x150_dropoff.ejs', payload } as IPaperRender;
        case PaperSize.SIZE_A4:
          return {
            viewPath: codEnabled ? 'reports/labels/thaipost/A4_dropoff_cod.ejs' : 'reports/labels/thaipost/A4_dropoff.ejs',
            payload: { ...payload, products },
          } as IPaperRender;
      }
      break;
    }
    case EnumTrackingType.BOOK: {
      switch (paperSize) {
        case PaperSize.SIZE_100x150:
          return { viewPath: 'reports/labels/thaipost/100x150_book.ejs', payload } as IPaperRender;
        case PaperSize.SIZE_A4:
          return { viewPath: 'reports/labels/thaipost/A4_book.ejs', payload: { ...payload, products } } as IPaperRender;
      }
      break;
    }
    case EnumTrackingType.MANUAL: {
      switch (paperSize) {
        case PaperSize.SIZE_100x150:
          return { viewPath: 'reports/labels/thaipost/100x150_manual.ejs', payload } as IPaperRender;
        case PaperSize.SIZE_A4:
          return { viewPath: 'reports/labels/thaipost/A4_manual.ejs', payload: { ...payload, products } } as IPaperRender;
      }
      break;
    }
  }
};

const expandSortingCode = (
  sortCode: string,
): {
  ext1: string;
  ext2: string;
  ext3: string;
} => {
  const value = sortCode.split('-');
  return {
    ext1: value[0],
    ext2: value[1],
    ext3: value[2],
  };
};

export const getLabelPayloadFlashExpress = (
  params: IPaperParam,
  payload: IPurchaseOrderPaperModel,
  data: IFlashExpressCreateOrderResponse,
  products: IPurchaseOrderItemListPaperModel[],
): IPaperRender => {
  const { paperSize } = params;
  const { trackingType, codEnabled } = payload;

  switch (trackingType) {
    case EnumTrackingType.DROP_OFF: {
      const labelDetail = data.data as IFlashExpressCreateOrderResponseData;

      labelDetail.expandedSortCode = expandSortingCode(labelDetail.sortCode);
      labelDetail.expandedDstStoreName = expandSortingCode(labelDetail.dstStoreName);

      switch (paperSize) {
        case PaperSize.SIZE_100x150:
          return {
            viewPath: codEnabled ? 'reports/labels/flash/100x150_cod.ejs' : 'reports/labels/flash/100x150.ejs',
            payload: { ...payload, labelDetail },
          } as IPaperRender;
        case PaperSize.SIZE_A4:
          return {
            viewPath: codEnabled ? 'reports/labels/flash/A4_cod.ejs' : 'reports/labels/flash/A4.ejs',
            payload: { ...payload, labelDetail, products },
          } as IPaperRender;
      }
      break;
    }
    case EnumTrackingType.MANUAL: {
      switch (paperSize) {
        case PaperSize.SIZE_100x150:
          return {
            viewPath: 'reports/labels/flash/100x150_manual.ejs',
            payload,
          } as IPaperRender;
        case PaperSize.SIZE_A4:
          return {
            viewPath: 'reports/labels/flash/A4_manual.ejs',
            payload: { ...payload, products },
          } as IPaperRender;
      }
      break;
    }
  }
};
export const getLabelPayloadJandTExpress = (
  params: IPaperParam,
  payload: IPurchaseOrderPaperModel,
  data: IJAndTExpressResponseData,
  products: IPurchaseOrderItemListPaperModel[],
): IPaperRender => {
  const { paperSize } = params;
  const { trackingType, codEnabled } = payload;

  switch (trackingType) {
    case EnumTrackingType.DROP_OFF: {
      const labelDetail = data.responseitems[0];
      switch (paperSize) {
        case PaperSize.SIZE_100x150:
          return {
            viewPath: codEnabled ? 'reports/labels/j_and_t/100x150_cod.ejs' : 'reports/labels/j_and_t/100x150.ejs',
            payload: { ...payload, labelDetail },
          } as IPaperRender;
        case PaperSize.SIZE_A4:
          return {
            viewPath: codEnabled ? 'reports/labels/j_and_t/A4_cod.ejs' : 'reports/labels/j_and_t/A4.ejs',
            payload: { ...payload, labelDetail, products },
          } as IPaperRender;
      }
      break;
    }
    case EnumTrackingType.MANUAL: {
      switch (paperSize) {
        case PaperSize.SIZE_100x150:
          return {
            viewPath: 'reports/labels/j_and_t/100x150_manual.ejs',
            payload: { ...payload },
          } as IPaperRender;
        case PaperSize.SIZE_A4:
          return {
            viewPath: 'reports/labels/j_and_t/A4_manual.ejs',
            payload: { ...payload, products },
          } as IPaperRender;
      }
      break;
    }
  }
};
export const getLabelPayloadDefault = (params: IPaperParam, payload: IPurchaseOrderPaperModel, products: IPurchaseOrderItemListPaperModel[]): IPaperRender => {
  const { paperSize } = params;
  switch (paperSize) {
    case PaperSize.SIZE_100x150:
      return {
        viewPath: 'reports/labels/default/100x150.ejs',
        payload: { ...payload },
      } as IPaperRender;
    case PaperSize.SIZE_A4:
      return {
        viewPath: 'reports/labels/default/A4.ejs',
        payload: { ...payload, products },
      } as IPaperRender;
  }
};
