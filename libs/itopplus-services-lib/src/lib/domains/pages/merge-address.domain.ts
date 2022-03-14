export const mergeAddress = (addressObj) => {
  const address = `${addressObj.mainAddress}  ${addressObj.district}  ${addressObj.province}  ${addressObj.postCode}  ${addressObj.country}`;
  return address;
};
export const mergeCurrency = (currencyObj) => {
  const currency = `${currencyObj.currencyTitle}`;
  return currency;
};
export const mergeLanguage = (languageObj) => {
  const language = `${languageObj.languageTitle}`;
  return language;
};
