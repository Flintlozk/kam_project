export const checkUUID = (name: string): boolean => {
  const regexStorage = new RegExp('[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}');
  if (regexStorage.test(name)) {
    return true;
  } else {
    return false;
  }
};
