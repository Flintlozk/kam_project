import {
  EnumPurchasingPayloadType,
  FacebookMessagingType,
  FacebookTemplateButtonType,
  FacebookWebViewHeight,
  IFacebookMessagePayloadTypeEnum,
  IFacebookPipelineStepTemplateType,
  IFormPayloadData,
  ILineFlexMessage,
  ILineFlexMessageButtonWebAppTemplate,
  IPayloadContainer,
  PayloadMessages,
  PayloadParams,
  ViewRenderType,
} from '@reactor-room/itopplus-model-lib';

// TODO : Defind Message Interface
export function combineLogisticPaymentSelector(
  { webViewUrl, PSID, audienceID, hashKey }: PayloadParams,
  { title, subtitle }: PayloadMessages,
  viewType: ViewRenderType,
): IFormPayloadData {
  const stepType = EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT;
  const url = `${webViewUrl}?type=${stepType}&psid=${PSID}&audienceId=${audienceID}&view=${viewType}&auth=${hashKey}`;

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

export const setLineFlexMessagePurchase = (payload: IPayloadContainer, purchasingPayloadType: EnumPurchasingPayloadType): ILineFlexMessage => {
  const paramFlex = {
    bubble_receipt: null,
    button_webapp: null,
    bubble_recommend_singleproduct: null,
  } as ILineFlexMessage;
  switch (purchasingPayloadType) {
    case EnumPurchasingPayloadType.SELECT_SINGLE_PRODUCT:
      paramFlex.bubble_recommend_singleproduct = {
        nameproduct: payload.json.message.attachment.payload.elements[0].title,
        price: payload.json.message.attachment.payload.elements[0].subtitle,
        image: payload.json.message.attachment.payload.elements[0].image_url,
        button: 'Order',
        url: '',
      };
      break;
    default:
      paramFlex.button_webapp = {
        template: {
          title: 'ยืนยันการสั่งซื้อ',
          text: 'กรุณากดปุ่ม "ยืนยัน" เพื่อดำเนินการสั่งซื้อ',
          actions: [{ label: 'ยืนยัน' }],
        },
      } as ILineFlexMessageButtonWebAppTemplate;
      break;
  }
  return paramFlex;
};
