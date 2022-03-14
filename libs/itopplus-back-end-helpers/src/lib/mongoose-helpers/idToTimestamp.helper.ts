import { ObjectId } from 'mongodb';

export const timestampToId = (date: string, time?: string): ObjectId => {
  return new ObjectId(Math.floor(Number(new Date(time ? `${date} ${time}` : date)) / 1000).toString(16) + '0000000000000000');
};
