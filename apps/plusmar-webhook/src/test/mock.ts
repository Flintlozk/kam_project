import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';

// eslint-disable-next-line @typescript-eslint/ban-types
export const mock = <T extends {}, K extends keyof T>(object: T, property: K, value: T[K]) => {
  Object.defineProperty(object, property, { get: () => value });
};
