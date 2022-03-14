import {
  EnumPurchasingPayloadType,
  FacebookMessagingType,
  FacebookTemplateButtonType,
  FacebookWebViewHeight,
  IFacebookMessagePayloadTypeEnum,
  IFacebookPipelineStepTemplateType,
  IFormPayloadData,
  PayloadParams,
  QuickPayChatPreviewPayload,
  ViewRenderType,
} from '@reactor-room/itopplus-model-lib';

export function sendQuickPayPreview({ webViewUrl, PSID, audienceID, hashKey }: PayloadParams, option: QuickPayChatPreviewPayload, viewType: ViewRenderType): IFormPayloadData {
  const stepType = EnumPurchasingPayloadType.QUICK_PAY_PAYMENT_PREVIEW;
  const webview = `${webViewUrl}?type=${stepType}&audienceId=${audienceID}&quickPayId=${option.quickPayID}&psid=${PSID}&view=${viewType}&auth=${hashKey}`;
  return <IFormPayloadData>{
    recipient: { id: PSID },
    message: {
      attachment: {
        type: IFacebookMessagePayloadTypeEnum.TEMPLATE,
        payload: {
          template_type: IFacebookPipelineStepTemplateType.GENERIC,
          elements: [
            {
              title: option.title,
              subtitle: option.subTitle,
              buttons: [
                {
                  type: FacebookTemplateButtonType.WEB_URL,
                  url: webview,
                  title: 'Payment',
                  webview_height_ratio: FacebookWebViewHeight.TALL,
                  messenger_extensions: true,
                },
              ],
            },
          ],
        },
      },
    },
    messaging_type: FacebookMessagingType.RESPONSE,
  };
}
