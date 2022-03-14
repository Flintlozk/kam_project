/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty as empty } from 'lodash';
export const isEmpty = (obj: any): boolean => {
  return empty(obj);
};

export const deepCopy = <T>(objOrArr: T): T => JSON.parse(JSON.stringify(objOrArr));

export const findObjectByProp = <T, R>(object: T, props: string, value: string | number | boolean): R => {
  const keys = Object.keys(object);
  const result = [];
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const target = object[key];

    if (target[props] === value) {
      result.push(target);
      break;
    }
  }
  return result[0];
};

export const cloneAttributes = (source, dest): void => {
  for (const attributeName in source) {
    if (source.hasOwnProperty(attributeName) && attributeName !== '_id') {
      dest[attributeName] = source[attributeName];
    }
  }
};

export const convertBinaryToBuffer = (data: Promise<any>): Promise<{ data: any; filename: string; mimetype: string }> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const { filename, mimetype, createReadStream } = await data;
    const imageStream = createReadStream();
    const bufs = [];
    imageStream.on('data', (chunks) => {
      bufs.push(chunks);
    });

    imageStream.on('end', () => {
      resolve({
        data: Buffer.concat(bufs),
        filename,
        mimetype,
      });
    });

    imageStream.on('error', reject);
  });
};

export function groupBy<T>(arr, criteria): T {
  return arr.reduce(function (obj, item) {
    const key = typeof criteria === 'function' ? criteria(item) : item[criteria];
    if (!obj.hasOwnProperty(key)) {
      obj[key] = [];
    }
    obj[key].push(item);

    return obj;
  }, {});
}

export function removeUndefinedFromArray(object: Array<any>): Array<any> {
  const result = object.filter((x) => x !== undefined);
  return result;
}

export function checkEmptyObject(params: any): boolean {
  if (Object.keys(params).length === 0) {
    return false;
  } else {
    return true;
  }
}

export const concatObjToParamsBackend = <T>(obj: T): string => {
  if (typeof obj === 'object' && empty(obj)) {
    throw new Error('NOT_A_VALID_OBJECT');
  }
  let concatStr = '';
  for (const [key, value] of Object.entries(obj)) {
    concatStr += `${key}=${value}&`;
  }
  concatStr = '?' + concatStr.substr(0, concatStr?.length - 1);
  return concatStr.trim();
};

export const getArrayChunk = <T>(list: T[], max: number): [T[]] => {
  const chucks = [];
  const limit = Math.ceil(Number(list.length) / max);

  let index = [0, limit];
  for (let i = 0; i < max; i++) {
    const slice = list.slice(index[0], index[1]);
    index = nextLength(index[0], index[1], limit);
    chucks.push(slice);
  }
  return <[T[]]>chucks.filter((x) => x.length);
};

export const nextLength = (start: number, end: number, maxListPerPage: number): number[] => {
  let arr = [];
  arr = [Number(end), Number(end) + maxListPerPage];
  return arr;
};
