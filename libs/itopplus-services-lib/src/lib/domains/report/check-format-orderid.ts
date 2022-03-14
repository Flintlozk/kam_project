export const checkFormatOrderID = (orderID): string => {
  const infrontOrder = 'OR-';
  const orderInfront = '0';
  const orderString = orderID.toString();
  const numberOfOrder = orderString.length;
  let newOrderId = '';
  if (numberOfOrder < 10) {
    const numberAdd = 10 - numberOfOrder;
    newOrderId = infrontOrder + orderInfront.repeat(numberAdd) + orderID;
  } else {
    newOrderId = infrontOrder + orderID;
  }
  return newOrderId;
};
