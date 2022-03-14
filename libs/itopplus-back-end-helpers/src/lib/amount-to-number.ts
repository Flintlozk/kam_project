export const getNumberFromAmount = (amount: string): number => {
  const amountToNumber = parseFloat(amount.replace(/[^\d.\-eE+]/g, ''));
  if (typeof amountToNumber !== 'number') throw new Error('getNumberFromAmount() error unable to convert to number');
  return amountToNumber;
};
