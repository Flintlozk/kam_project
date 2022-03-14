import { onWaitFor } from '@reactor-room/itopplus-back-end-helpers';
import pg, { Pool, PoolConfig } from 'pg';

const types = pg.types;
types.setTypeParser(1114, function (stringValue) {
  return stringValue;
});

export class PGConnection {
  public static connector: Pool;
  public static async connect(options: PoolConfig): Promise<Pool> {
    const pool = new Pool(options);
    pool.on('error', async (error) => {
      console.log('PG error:' + error);
      await onWaitFor(5);
      const pool = new Pool(options);
      await pool.connect();
      PGConnection.connector = pool;
      return PGConnection.connector;
    });
    await pool.connect();
    PGConnection.connector = pool;
    return PGConnection.connector;
  }
}
export class PGConnectionWrite {
  public static connector: Pool;
  public static async connect(options: PoolConfig): Promise<Pool> {
    const pool = new Pool(options);
    pool.on('error', async (error) => {
      console.log('PG error:' + error);
      await onWaitFor(5);
      const pool = new Pool(options);
      await pool.connect();
      PGConnectionWrite.connector = pool;
      return PGConnectionWrite.connector;
    });
    await pool.connect();
    PGConnectionWrite.connector = pool;
    return PGConnectionWrite.connector;
  }
}
