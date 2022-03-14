export const insertDecimal = (num: number): string => {
  return (num / 100).toFixed(2);
};
