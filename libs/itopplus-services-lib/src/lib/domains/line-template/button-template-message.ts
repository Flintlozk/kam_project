import { ILineFlexMessageButtonWebAppTemplate, ILineFlexSingleButtonTemplate } from '@reactor-room/itopplus-model-lib';
export const buttonTemplateWebAppAction = (title: string, description: string, url: string, button: string): ILineFlexMessageButtonWebAppTemplate => {
  return {
    type: 'template',
    altText: 'this is a buttons template',
    template: {
      type: 'buttons',
      imageBackgroundColor: '#54B1FF',
      title: title,
      text: description,
      actions: [
        {
          type: 'uri',
          label: button,
          uri: url,
        },
      ],
    },
  };
};

export const lineDownloadAttachmentButtonTemplate = (label: string, url: string): ILineFlexMessageButtonWebAppTemplate => {
  return {
    type: 'template',
    altText: 'Send attachment',
    template: {
      type: 'buttons',
      text: label,
      actions: [
        {
          type: 'uri',
          label: 'Download',
          uri: url,
        },
      ],
    },
  };
};
