import { ILineBubbleMessageProductDetail, ILineBubbleMessageReceiptParam, ILineFlexMessage, ILineMessageType } from '@reactor-room/itopplus-model-lib';
export const bubbleTemplateMessageProduct = ({ productname, totalitem, attr, image, price }: ILineBubbleMessageProductDetail, updateDatetime: string) => {
  return {
    type: 'bubble',
    hero: {
      type: 'image',
      url: image,
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: productname,
          weight: 'bold',
          size: 'xl',
        },
        {
          type: 'text',
          text: attr,
          size: 'sm',
          margin: 'sm',
        },
        {
          type: 'text',
          text: totalitem,
          size: 'sm',
          margin: 'md',
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      flex: 0,
      spacing: 'sm',
      contents: [
        {
          type: 'box',
          layout: 'baseline',
          spacing: 'sm',
          margin: 'md',
          contents: [
            {
              type: 'text',
              text: 'อัพเดทคำสั่งซื้อ',
              size: 'sm',
              color: '#AAAAAA',
              flex: 3,
            },
            {
              type: 'text',
              text: updateDatetime,
              size: 'sm',
              color: '#AAAAAA',
              flex: 5,
              wrap: true,
            },
          ],
        },
        {
          type: 'spacer',
          size: 'sm',
        },
      ],
    },
  };
};

export const bubbleTemplateMessageSummary = ({ subtotalprice, shippingprice, vat, totalprice, updateDatetime }: ILineBubbleMessageReceiptParam) => {
  return {
    type: 'bubble',
    header: {
      type: 'box',
      layout: 'horizontal',
      contents: [
        {
          type: 'text',
          text: 'Summary',
          weight: 'bold',
          size: 'xl',
          color: '#131313FF',
          contents: [],
        },
      ],
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'box',
          layout: 'baseline',
          contents: [
            {
              type: 'text',
              text: 'มูลค่าสินค้า',
              size: 'lg',
              color: '#AAAAAA',
              flex: 3,
            },
            {
              type: 'text',
              text: subtotalprice,
              size: 'lg',
              color: '#4B4B4BFF',
              flex: 5,
              align: 'end',
              wrap: true,
            },
          ],
        },
        {
          type: 'box',
          layout: 'baseline',
          margin: 'lg',
          contents: [
            {
              type: 'text',
              text: 'ค่าจัดส่ง',
              size: 'lg',
              color: '#AAAAAA',
              flex: 3,
            },
            {
              type: 'text',
              text: shippingprice,
              size: 'lg',
              color: '#4B4B4BFF',
              flex: 5,
              align: 'end',
            },
          ],
        },
        {
          type: 'box',
          layout: 'baseline',
          margin: 'lg',
          contents: [
            {
              type: 'text',
              text: 'ภาษี',
              size: 'lg',
              color: '#AAAAAA',
              flex: 3,
            },
            {
              type: 'text',
              text: vat,
              size: 'lg',
              color: '#4B4B4BFF',
              flex: 5,
              align: 'end',
            },
          ],
        },
        {
          type: 'box',
          layout: 'baseline',
          margin: 'xl',
          contents: [
            {
              type: 'text',
              text: 'รวมทั้งหมด',
              size: 'lg',
              color: '#AAAAAA',
              flex: 3,
            },
            {
              type: 'text',
              text: totalprice,
              size: 'lg',
              color: '#4B4B4BFF',
              flex: 3,
              align: 'end',
            },
          ],
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      flex: 0,
      spacing: 'sm',
      contents: [
        {
          type: 'box',
          layout: 'baseline',
          spacing: 'sm',
          margin: 'md',
          contents: [
            {
              type: 'text',
              text: 'อัพเดทคำสั่งซื้อ',
              size: 'sm',
              color: '#AAAAAA',
              flex: 3,
            },
            {
              type: 'text',
              text: updateDatetime,
              size: 'sm',
              color: '#AAAAAA',
              flex: 5,
              wrap: true,
            },
          ],
        },
        {
          type: 'spacer',
          size: 'sm',
        },
      ],
    },
  };
};

export const bubbleTemplateMessageCustomerForm = (title: string, description: string, url: string, button: string) => {
  return {
    type: 'flex',
    altText: 'This is a Flex Message',
    contents: {
      type: 'bubble',
      direction: 'ltr',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: description,
            weight: 'bold',
            color: '#535353FF',
            align: 'start',
            contents: [],
          },
          // {
          //   type: 'text',
          //   text: description,
          //   weight: 'regular',
          //   color: '#8A8989FF',
          //   align: 'start',
          //   margin: 'lg',
          //   contents: [],
          // },
        ],
      },
      footer: {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'button',
            action: {
              type: 'uri',
              label: button,
              uri: url,
            },
          },
        ],
      },
    },
  };
};

export const bubbleTemplateMessageRecomendSingleProduct = (image: string, nameproduct: string, price: string, button: string, url: string) => {
  return {
    type: 'flex',
    altText: 'This is a Flex Message',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: image,
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'text',
            text: nameproduct,
            weight: 'bold',
            size: 'xl',
            wrap: true,
            contents: [],
          },
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'text',
                text: price,
                weight: 'bold',
                size: 'xl',
                flex: 0,
                wrap: true,
                contents: [],
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            action: {
              type: 'uri',
              label: button,
              uri: url,
            },
            style: 'primary',
          },
        ],
      },
    },
  };
};
