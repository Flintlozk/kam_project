export const checkCodStatus = (detail): boolean => {
  let result = false;
  if (detail != null) {
    if (detail.cod_status === true) {
      result = detail.cod_status;
    }
  }
  return result;
};
