export const deepCopy = <T>(objOrArr: T): T => JSON.parse(JSON.stringify(objOrArr));
