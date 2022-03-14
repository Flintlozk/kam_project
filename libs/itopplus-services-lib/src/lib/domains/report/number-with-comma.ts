export const numberWithComma = (data: string | number): string => {
  return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
