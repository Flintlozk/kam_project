import {
  EnumLeadPayloadType,
  FacebookMessagingType,
  FacebookTemplateButtonType,
  FacebookWebViewHeight,
  IFacebookMessagePayloadTypeEnum,
  IFacebookPipelineStepTemplateType,
  IFormPayloadData,
  LeadPayloadOption,
  LeadPayloadParams,
  ViewRenderType,
} from '@reactor-room/itopplus-model-lib';

export function leadCustomForm(
  { webViewUrl, PSID, refID, audienceID, hashKey }: LeadPayloadParams,
  { title, button }: LeadPayloadOption,
  viewType: ViewRenderType,
): IFormPayloadData {
  const stepType = EnumLeadPayloadType.CUSTOM_FORM;
  const url = `${webViewUrl}?type=${stepType}&psid=${PSID}&ref=${refID}&view=${viewType}&audienceId=${audienceID}&auth=${hashKey}`;

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
              title: button,
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
