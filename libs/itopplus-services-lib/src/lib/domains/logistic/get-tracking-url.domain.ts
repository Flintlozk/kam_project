import { EnumLogisticDeliveryProviderType } from '@reactor-room/itopplus-model-lib';

export const getLogisitcTrackingURL = (provider: EnumLogisticDeliveryProviderType, trackNo: string): string => {
  switch (provider) {
    case EnumLogisticDeliveryProviderType.THAILAND_POST:
    case EnumLogisticDeliveryProviderType.EMS_THAILAND:
      return `https://track.thailandpost.co.th/?trackNumber=${trackNo}`;
    case EnumLogisticDeliveryProviderType.J_AND_T:
      return `https://www.jtexpress.co.th/index/query/gzquery.html?bills=${trackNo}`;
    case EnumLogisticDeliveryProviderType.FLASH_EXPRESS:
      return `https://www.flashexpress.com/tracking/?se=${trackNo}`;
    case EnumLogisticDeliveryProviderType.ALPHA:
      return `https://www.alphafast.com/th/track?id=${trackNo}`;
    // case EnumLogisticDeliveryProviderType.NINJA_VAN:
    //   return `https://www.ninjavan.co/th-th/?tracking_id=${trackNo}`;
    default:
      return null;
  }
};

// [TRACKING URL]
// DHL eCommerce https://dhlecommerce.asia/Portal/Track?ref=XX0000000
// Flash Express https://www.flashexpress.com/tracking/?se=XX0000000
// Kerry Express https://th.kerryexpress.com/en/track/?track=XX0000000
// Grab Express http://th.grabexpress.com/tracking.php?trackingId=XX0000000
// CJ Logistic http://thagnexs.cjkx.net/web/g_tracking_eng.jsp?slipno=XX0000000
// SCG EXPRESS https://www.scgexpress.co.th/tracking/detail/XX0000000
// Nim Express http://www.nimexpress.com/web/p/tracking?i=XX0000000
// TNT https://www.tnt.com/express/en_th/site/shipping-tools/tracking.html?searchType=CON&cons=XX0000000
