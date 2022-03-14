export const parseObject = (object) => {
  try {
    return JSON.parse(object);
  } catch (err) {
    return object;
  }
};
