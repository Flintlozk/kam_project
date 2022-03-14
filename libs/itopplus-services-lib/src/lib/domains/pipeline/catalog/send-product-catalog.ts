import {
  EnumPurchasingPayloadType,
  FacebookMessagingType,
  FacebookTemplateButtonType,
  FacebookWebViewHeight,
  IFacebookMessagePayloadTypeEnum,
  IFacebookPipelineStepTemplateType,
  IFormPayloadData,
  ISendCatalogChatBoxOptions,
  PayloadParams,
  ViewRenderType,
} from '@reactor-room/itopplus-model-lib';

export function sendProductCatalog({ webViewUrl, PSID, audienceID, hashKey }: PayloadParams, option: ISendCatalogChatBoxOptions, viewType: ViewRenderType): IFormPayloadData {
  const stepType = EnumPurchasingPayloadType.SEND_PRODUCT_CATALOG;
  const webview = `${webViewUrl}?type=${stepType}&audienceId=${audienceID}&catalogID=${option.catalogID}&psid=${PSID}&view=${viewType}&auth=${hashKey}&page=${option.page}`;
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
                  title: 'Open',
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
