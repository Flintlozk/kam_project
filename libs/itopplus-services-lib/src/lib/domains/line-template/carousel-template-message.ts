export const carouselTemplateMessageReceipt = (contents: any[]) => {
  return {
    type: 'flex',
    altText: 'This is a Flex Message',
    contents: {
      type: 'carousel',
      contents: contents,
    },
  };
};
