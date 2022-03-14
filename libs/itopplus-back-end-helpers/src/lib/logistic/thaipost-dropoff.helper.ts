export const nextLotNumber = (oldLotNumber: string): string => {
  const getPart = oldLotNumber.replace(/[^\d.]/g, '');
  const num = parseInt(getPart);
  const newVal = num + 1;
  const reg = new RegExp(num.toString());
  const newstring = oldLotNumber.replace(reg, newVal.toString());
  return newstring.padStart(8, '0');
};

export const getCheckDigit = (lotNumber: string): number => {
  const weights = [8, 6, 4, 2, 3, 5, 9, 7];
  const numArr = Array.from(String(lotNumber), Number);
  let checkDigit = 0;
  numArr.forEach((n, i) => (checkDigit = checkDigit + n * weights[i]));
  checkDigit = 11 - (checkDigit % 11);
  if (checkDigit == 10) checkDigit = 0;
  else if (checkDigit == 11) checkDigit = 5;
  return checkDigit;
};

export const assembleThaiPostDropOffTracking = (currentIndex: number, start: number, end: number, prefix: string, suffix: string): string => {
  const mainPath = start + currentIndex;
  if (mainPath > end) throw new Error('TRACKING_INDEX_OUT_OF_BOUNDARY');
  const numeric = String(mainPath).padStart(8, '0');
  const digit = getCheckDigit(numeric);
  return `${prefix}${numeric}${digit}${suffix}`;
};
