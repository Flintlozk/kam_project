import {
  EnumPurchasingPayloadType,
  FacebookMessagingType,
  FacebookTemplateButtonType,
  FacebookWebViewHeight,
  IFacebookMessagePayloadTypeEnum,
  IFacebookPipelineStepTemplateType,
  IFormPayloadData,
  PayloadMessages,
  PayloadParams,
  ViewRenderType,
} from '@reactor-room/itopplus-model-lib';

export function checkOut2C2PPaymentTemplate(
  { webViewUrl, PSID, audienceID, hashKey }: PayloadParams,
  { title, subtitle }: PayloadMessages,
  viewType: ViewRenderType,
): IFormPayloadData {
  const stepType = EnumPurchasingPayloadType.CHECKOUT_2C2P;
  const url = `${webViewUrl}?type=${stepType}&psid=${PSID}&audienceId=${audienceID}&view=${viewType}&auth=${hashKey}`;
  return getTemplate(PSID, url, title, subtitle);
}
export function checkOutOmisePaymentTemplate(
  { webViewUrl, PSID, audienceID, hashKey }: PayloadParams,
  { title, subtitle }: PayloadMessages,
  viewType: ViewRenderType,
): IFormPayloadData {
  const stepType = EnumPurchasingPayloadType.CHECKOUT_OMISE;
  const url = `${webViewUrl}?type=${stepType}&psid=${PSID}&audienceId=${audienceID}&view=${viewType}&auth=${hashKey}`;
  return getTemplate(PSID, url, title, subtitle);
}
export function checkOutPaypalPaymentTemplate(
  { webViewUrl, PSID, audienceID, hashKey }: PayloadParams,
  { title, subtitle }: PayloadMessages,
  viewType: ViewRenderType,
): IFormPayloadData {
  const stepType = EnumPurchasingPayloadType.CHECKOUT_PAYPAL;
  const url = `${webViewUrl}?type=${stepType}&psid=${PSID}&audienceId=${audienceID}&view=${viewType}&auth=${hashKey}`;
  return getTemplate(PSID, url, title, subtitle);
}

function getTemplate(PSID: string, url: string, title: string, subtitle: string): IFormPayloadData {
  return <IFormPayloadData>{
    recipient: { id: PSID },
    message: {
      attachment: {
        type: IFacebookMessagePayloadTypeEnum.TEMPLATE,
        payload: {
          template_type: IFacebookPipelineStepTemplateType.BUTTON,
          text: title,
          buttons: [
            {
              type: FacebookTemplateButtonType.WEB_URL,
              url: url,
              title: subtitle,
              webview_height_ratio: FacebookWebViewHeight.FULL,
              messenger_extensions: true,
            },
          ],
        },
      },
    },
    messaging_type: FacebookMessagingType.RESPONSE,
  };
}
