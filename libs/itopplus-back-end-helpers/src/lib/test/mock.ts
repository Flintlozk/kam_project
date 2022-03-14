import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';

export const execQueryResult = (result, jest) => {
  PostgresHelper.execQuery = jest.fn().mockImplementationOnce((client: Pool, query: string, parame: any[], debug?: boolean): any => new Promise((resolve) => resolve(result)));
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const mock = <T extends {}, K extends keyof T>(object: T, property: K, value: T[K]): void => {
  Object.defineProperty(object, property, { get: () => value });
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const mongoMockTransactionFn = { startTransaction: () => {}, abortTransaction: () => {}, commitTransaction: () => {}, endSession: () => {} };
