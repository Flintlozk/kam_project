import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IProductStatus } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';

export function getProductStatus(client: Pool): Promise<[IProductStatus]> {
  return new Promise<[IProductStatus]>((resolve, reject) => {
    const bindings = {
      active: true,
    };
    const SQL = `
              SELECT  id,
                      "name"
            FROM product_status
            WHERE active = :active
    `;

    const returnSQLBindings = PostgresHelper.convertParameterizedQuery(SQL, bindings);

    const data = PostgresHelper.execQuery<[IProductStatus]>(client, returnSQLBindings.sql, returnSQLBindings.bindings);

    data
      .then((result) => {
        resolve(result);
      })
      .catch((err) => reject(err));
  });
}
