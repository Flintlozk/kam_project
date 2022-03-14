import { env } from 'process';
const IS_PRODUCTION = env.NODE_ENV === 'production';
// const IS_STAGING = env.NODE_ENV === 'staging';
const environmentLocal = {
  client_id: '971440548408-3ks8d18h6g0ikghg685rc9m6jvgvr516.apps.googleusercontent.com',
  client_secret: 'HgzAY0WCvHqSCgM5q9D70T3N',
  pageKey: '55f9e154604e6dff',
  tokenKey: "$E'TC}H2(o>X-.+,YG3NxZ^'Q)5f`h[}S6eER>kRk}F=IvQx`\"Gp^g$,tWv64#y",
  PG_URL_READ: 'postgres://developer:tbdadmin@35.186.155.175:5432/crm-staging',
  PG_URL_WRITE: 'postgres://developer:tbdadmin@35.186.155.175:5432/crm-staging',
  PG_MAX_CON_READ: 2,
  PG_MAX_CON_WRITE: 2,
  redisHost: env.REDIS_HOST_CRM,
  redisHostPort: '6379',
  s3Secret: '9876bbf28a87787c57f2bb848d125d1a9853c4a2375fafeb84c4996b3cfefe5b',
  s3AccessKey: '6ee720f549c739ef',
  production: true,
  port: '3333',
  url: 'https://democrm.more-commerce.com',
  urlApi: 'https://democrm-api.more-commerce.com',
  minioStorage: 'crmstorage-staging',
};
if (IS_PRODUCTION) {
  environmentLocal.pageKey = env.PAGE_KEY;
  environmentLocal.tokenKey = env.TOKEN_KEY;
  environmentLocal.PG_URL_READ = env.PG_URL_READ_CRM;
  environmentLocal.PG_URL_WRITE = env.PG_URL_WRITE_CRM;
  environmentLocal.PG_MAX_CON_READ = 20;
  environmentLocal.PG_MAX_CON_WRITE = 20;
  environmentLocal.redisHostPort = '6379';
  environmentLocal.minioStorage = 'crmstorage-staging';
}
export const environment = environmentLocal;
