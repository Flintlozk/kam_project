import { INameIDPair } from '@reactor-room/itopplus-model-lib';
export const generateVariants = (variantData: INameIDPair[][]): INameIDPair[][] => {
  let i: number, j: number, variantLength: number, variantDataLength: number;
  const variants = [];
  if (!variantData || variantData.length === 0) return variantData;
  const firstVariant = variantData.splice(0, 1);
  variantData = generateVariants(variantData);
  for (i = 0, variantLength = firstVariant[0].length; i < variantLength; i++) {
    if (variantData && variantData.length)
      for (j = 0, variantDataLength = variantData.length; j < variantDataLength; j++) variants.push([firstVariant[0][i]].concat(variantData[j]));
    else variants.push([firstVariant[0][i]]);
  }
  return variants;
};
