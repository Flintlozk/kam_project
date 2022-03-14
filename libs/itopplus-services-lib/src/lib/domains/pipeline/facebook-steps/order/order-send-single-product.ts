import {
  EnumPurchasingPayloadType,
  FacebookMessagingType,
  FacebookTemplateButtonType,
  FacebookWebViewHeight,
  IFacebookMessagePayloadTypeEnum,
  IFacebookPipelineStepTemplateType,
  IFormPayloadData,
  PayloadParams,
  ProductMessagePayload,
  ViewRenderType,
} from '@reactor-room/itopplus-model-lib';

export function orderSendSingleProduct({ webViewUrl, PSID, audienceID, hashKey }: PayloadParams, option: ProductMessagePayload, viewType: ViewRenderType): IFormPayloadData {
  const stepType = EnumPurchasingPayloadType.SELECT_SINGLE_PRODUCT;
  const webview = `${webViewUrl}?type=${stepType}&audienceId=${audienceID}&productId=${option.productId}&psid=${PSID}&view=${viewType}&auth=${hashKey}`;
  const payload = <IFormPayloadData>{
    recipient: { id: PSID },
    message: {
      attachment: {
        type: IFacebookMessagePayloadTypeEnum.TEMPLATE,
        payload: {
          template_type: viewType === ViewRenderType.FACEBOOK_WEBVIEW ? IFacebookPipelineStepTemplateType.GENERIC : IFacebookPipelineStepTemplateType.BUTTON,
          // buttons: [
          //   {
          //     title: 'Order',
          //     url: webview,
          //   },
          // ],
          elements: [
            {
              title: option.title,
              subtitle: option.subtitle,
              image_url: option.image,
              buttons: [
                {
                  type: FacebookTemplateButtonType.WEB_URL,
                  url: webview,
                  title: 'Order',
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

  if (viewType === ViewRenderType.LINE_LIFF) {
    payload.message.attachment.payload.buttons = [
      {
        title: 'Order',
        url: webview,
      },
    ];
    return payload;
  } else {
    return payload;
  }
}
