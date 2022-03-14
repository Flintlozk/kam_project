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

export function orderSendMultipleProduct({ webViewUrl, PSID, audienceID, hashKey }: PayloadParams, option: ProductMessagePayload, viewType: ViewRenderType): IFormPayloadData {
  const stepType = EnumPurchasingPayloadType.SELECT_MULTIPLE_PRODUCT;
  const webview = `${webViewUrl}?type=${stepType}&audienceId=${audienceID}&productId=${option.productId}&psid=${PSID}&view=${viewType}&auth=${hashKey}`;
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
}
