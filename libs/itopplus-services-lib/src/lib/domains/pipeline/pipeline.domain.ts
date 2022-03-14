import { TrackingOrderDetail, PipelineType } from '@reactor-room/itopplus-model-lib';
import * as url from 'url';

export function hardcodeTransformCurrencyType(currency: string): string {
  if (currency === 'THB (฿) Baht') return 'THB';
  else if (currency === 'USD ($) Dollar') return 'USD';
  else return currency;
}

export function getWebViewUrl(webviewURL: string, type: PipelineType): string {
  return url.resolve(webviewURL, type);
}

export function assembleTrackingMessage(tracking: TrackingOrderDetail, isCOD: boolean, isFlatRate: boolean): string {
  let message = '\n\n' as string;
  if (!isCOD) message += `${tracking.logisticName}\n`;
  message += `Shipping Date : ${tracking.shippingDate} ${tracking.shippingTime}\n`;
  message += 'Delivery within (Days) : 1 -2 Days\n';
  message += `Tracking No. : ${tracking.trackingNo}\n`;
  if (!isFlatRate && message !== '') message += `URL for Tracking : ${tracking.trackingUrl}\n`;

  return message;
}
