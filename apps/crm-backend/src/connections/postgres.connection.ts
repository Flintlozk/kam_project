import pg, { Pool, PoolConfig } from 'pg';

const types = pg.types;
types.setTypeParser(1114, function (stringValue) {
  return stringValue;
});

export class PGConnection {
  public static connector: Pool;
  public static connect(options: PoolConfig): Promise<Pool> {
    return new Promise((resolve, reject) => {
      const pool = new Pool(options);
      pool
        .connect()
        .then(() => {
          PGConnectionWrite.connector = pool;
          resolve(pool);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
export class PGConnectionWrite {
  public static connector: Pool;
  public static connect(options: PoolConfig): Promise<Pool> {
    return new Promise((resolve, reject) => {
      const pool = new Pool(options);
      pool
        .connect()
        .then(() => {
          PGConnectionWrite.connector = pool;
          resolve(pool);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
