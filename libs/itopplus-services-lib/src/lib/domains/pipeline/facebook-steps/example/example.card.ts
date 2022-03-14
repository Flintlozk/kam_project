import { FacebookTemplateButtonType, IFacebookMessagePayloadTypeEnum, IFacebookPipelineStepTemplateType, IFormPayloadData, PayloadParams } from '@reactor-room/itopplus-model-lib';

export const exampleCard = ({ webViewUrl, PSID, audienceID }: PayloadParams): IFormPayloadData => {
  const stepType = 'EnumPurchasingPayloadType.SELECT_ORDER';
  const webview = `${webViewUrl}?type=${stepType}&psid=${PSID}&audienceId=${audienceID}`;

  return {
    recipient: {
      id: PSID,
    },
    message: {
      attachment: {
        type: IFacebookMessagePayloadTypeEnum.TEMPLATE,
        payload: {
          template_type: IFacebookPipelineStepTemplateType.GENERIC,
          elements: [
            {
              title: 'Welcome!',
              image_url: 'https://petersfancybrownhats.com/company_image.png',
              subtitle: 'We have the right hat for everyone.',
              buttons: [
                {
                  type: FacebookTemplateButtonType.WEB_URL,
                  url: webview,
                  title: 'View Website',
                },
                {
                  type: FacebookTemplateButtonType.POSTBACK,
                  title: 'Start Chatting',
                  payload: 'DEVELOPER_DEFINED_PAYLOAD',
                },
              ],
            },
          ],
        },
      },
    },
  };
};
