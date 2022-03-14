export const transformOrderId = (value: number): string => {
  const orderIdLength = value.toString().length;
  const model = 'OR-0000000000';
  return model.substr(0, model.length - orderIdLength) + value;
};
