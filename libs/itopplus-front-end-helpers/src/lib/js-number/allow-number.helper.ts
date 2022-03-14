export const inputOnlyNumber = (evt: KeyboardEvent): boolean => {
  const regex = /^([0-9])$/;
  const result = regex.test(evt.key);
  return result;
};
