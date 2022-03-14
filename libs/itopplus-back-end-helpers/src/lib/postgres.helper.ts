/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool } from 'pg';
import { removeUndefinedFromArray } from './object.helper';

enum PoolClientType {
  SINGLE = 'SINGLE',
  TRANSACTION = 'TRANSACTION',
}
interface CustomPool extends Pool {
  clientSignature: string;
  clientType: PoolClientType;
}

interface ParamsMatchSize {
  status: boolean;
  params: Array<any>;
}
interface SQLPrepareStatement {
  sql: string;
  bindings: Array<any>;
}

type AnyStringOrNumberArray = string[] | number[];
export class PostgresHelper {
  constructor() {}
  public static joinInQueries(param: AnyStringOrNumberArray): string {
    return `('${param.join("','")}')`;
  }

  public static countParameter(query: string): number {
    const reg = RegExp(/\$[0-9]{1,4}/, 'gm');
    const result = query.match(reg);
    const uniqueParam = new Set(result);
    return uniqueParam.size;
  }

  public static convertParameterizedQuery<T>(sql: string, bindingsMap: T): SQLPrepareStatement {
    sql = sql.replace(/::/g, '&&&');
    const matches = sql.match(/(:[^ ),\n]*)/g) || [];
    const bindingIndexMatchMap = {};

    let bindingIndex = 1;
    for (const match of matches) {
      if (!bindingIndexMatchMap[match]) {
        bindingIndexMatchMap[match] = bindingIndex;
        bindingIndex += 1;
      }
      sql = sql.replace(match, `$${bindingIndexMatchMap[match]}`);
    }
    sql = sql.replace(/&&&/g, '::');
    return {
      sql,
      bindings: Object.keys(bindingIndexMatchMap).reduce((prev, key) => {
        return prev.concat(bindingsMap[key.substr(1)]);
      }, []),
    };
  }

  public static paramMatchWithQuery(query: string, params: Array<any>): ParamsMatchSize {
    const returnParam = removeUndefinedFromArray(params);
    if (this.countParameter(query) === returnParam.length) {
      return {
        status: true,
        params: returnParam,
      };
    } else {
      return {
        status: false,
        params: returnParam,
      };
    }
  }

  public static execQuery<T>(client: Pool, query: string, param: Array<any>, debug?: boolean): Promise<T> {
    if (debug) console.log('query >', query, param);
    return new Promise<T>((resolve, reject) => {
      const { status, params } = this.paramMatchWithQuery(query, param);
      if (status === false) {
        // reject('PARAM IS NOT MATCH NUMBER WITH QUERY \n ' + query);
        console.log('-< err_param_not_mactch_number_with_query >-', query);
        reject('PARAM IS NOT MATCH NUMBER WITH QUERY');
      } else {
        client.query(query, params, async (err_query, result) => {
          if (err_query) {
            const clientType = (<CustomPool>client).clientType;
            if (clientType && clientType === PoolClientType.TRANSACTION) await this.execBatchRollbackTransaction(client);
            reject(err_query);
          } else {
            if (debug) console.log('query result >', result);
            if (result.rowCount > 0) {
              resolve(result.rows as unknown as T);
            } else {
              resolve({} as unknown as T);
            }
          }
        });
      }
    });
  }

  public static execSingleWrite<T>(client: Pool, query: string, param: Array<any>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const { status, params } = this.paramMatchWithQuery(query, param);
      if (status === false) {
        reject('PARAM IS NOT MATCH NUMBER WITH QUERY \n' + query);
      } else {
        const shouldAbort = (err_abort) => {
          if (err_abort) {
            client.query('ROLLBACK', (err_rollback) => {
              if (err_rollback) {
                console.error('Error rolling back client', err_rollback.stack);
                reject(err_rollback);
              }
            });
          }
          return !!err_abort;
        };
        client.query('BEGIN', (err_begin_transaction) => {
          if (shouldAbort(err_begin_transaction)) reject(err_begin_transaction);
          else {
            client.query(query, params, (err_query, res_query) => {
              if (shouldAbort(err_query)) {
                reject(err_query);
              } else {
                client.query('COMMIT', (err_commit) => {
                  if (err_commit) {
                    console.error('Error committing transaction', err_commit.stack);
                    reject(err_commit);
                  }
                  resolve(res_query.rows[0]);
                });
              }
            });
          }
        });
      }
    });
  }

  public static execBeginBatchTransaction(client: Pool, signature?: string): Promise<CustomPool> {
    return new Promise<CustomPool>((resolve, reject) => {
      client.query('BEGIN', (err_begin_transaction) => {
        if (err_begin_transaction) {
          reject(err_begin_transaction);
        } else {
          (<CustomPool>client).clientSignature = signature;
          (<CustomPool>client).clientType = PoolClientType.TRANSACTION;
          resolve(client as CustomPool);
        }
      });
    });
  }

  public static execBatchCommitTransaction(client: Pool): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      client.query('COMMIT', (err_commit) => {
        if (err_commit) {
          console.error('Error committing transaction', err_commit.stack);
          reject(err_commit);
        } else {
          resolve(true);
        }
      });
    });
  }

  public static execBatchRollbackTransaction(client: Pool): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      client.query('ROLLBACK', (err_rollback) => {
        if (err_rollback) {
          console.error('Error rollback transaction', err_rollback.stack);
          reject(err_rollback);
        } else {
          resolve(false);
        }
      });
    });
  }

  public static execBatchTransaction<T>(client: Pool, query: string, param: Array<any>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const { status, params } = this.paramMatchWithQuery(query, param);
      if (status === false) {
        reject('PARAM IS NOT MATCH NUMBER WITH QUERY \n' + query);
      } else {
        const shouldAbort = (err_abort) => {
          if (err_abort) {
            client.query('ROLLBACK', (err_rollback) => {
              if (err_rollback) {
                console.error('Error rolling back client', err_rollback.stack);
                reject(err_rollback);
              } else {
                reject(err_abort);
              }
            });
          }
          return !!err_abort;
        };

        try {
          client.query(query, params, (err_query, result) => {
            if (shouldAbort(err_query)) return;
            if (result.rowCount > 0) {
              resolve(result.rows[0]);
            } else {
              resolve({} as T);
            }
          });
        } catch (err) {
          shouldAbort(err);
        }
      }
    });
  }

  public static execDynamicQueryTransaction(client: Pool, queries: Array<string>, params: Array<Array<any>>): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const shouldAbort = (err_abort) => {
          if (err_abort) {
            client.query('ROLLBACK', (err_rollback) => {
              if (err_rollback) {
                console.error('Error rolling back client', err_rollback.stack);
                reject(err_rollback);
              }
            });
          }
          return !!err_abort;
        };

        const queryResult = [];
        client.query('BEGIN', (err_begin_transaction) => {
          if (shouldAbort(err_begin_transaction)) {
            reject(err_begin_transaction);
          } else {
            for (let i = 0; i < queries.length; i++) {
              const query = queries[i];
              const param = params[i];
              client.query(query, param, (loop_err, loop_res) => {
                if (shouldAbort(loop_err)) {
                  reject(loop_err);
                } else {
                  queryResult.push(loop_res.rows[0]);
                }
              });
            }

            client.query('COMMIT', (err_commit) => {
              if (err_commit) {
                console.error('Error committing transaction', err_commit.stack);
                reject(err_commit);
              } else {
                resolve(queryResult);
              }
            });
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  public static mainStateQuery(client: Pool, state: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      client.query(state, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
