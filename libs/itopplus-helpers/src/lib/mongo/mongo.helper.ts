export const checkMongoID = (name: string): boolean => {
  const regexStorage = new RegExp('^[0-9a-fA-F]{24}$');
  if (regexStorage.test(name)) {
    return true;
  } else {
    return false;
  }
};
