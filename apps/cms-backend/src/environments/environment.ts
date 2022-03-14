import { environmentLib, IEnvironment } from '@reactor-room/environment-services-backend';
export const environment: IEnvironment = {
  ...environmentLib,
  PG_MAX_CON_READ: 2,
  PG_MAX_CON_WRITE: 2,
};
