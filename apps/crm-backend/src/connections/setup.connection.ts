import { CrmService } from '@reactor-room/crm-services-lib';
import { PoolConfig } from 'pg';
import { environment } from '../environments/environment';
import { getAWSS3Bucket } from './minio.connection';
import { PGConnection, PGConnectionWrite } from './postgres.connection';
import { getRedisClient } from './redis.connection';

export const setupConnection = async (): Promise<void> => {
  CrmService.readerClient = await PGConnection.connect({
    connectionString: environment.PG_URL_READ,
    max: environment.PG_MAX_CON_READ,
  } as PoolConfig);
  CrmService.writerClient = await PGConnectionWrite.connect({
    connectionString: environment.PG_URL_WRITE,
    max: environment.PG_MAX_CON_WRITE,
  } as PoolConfig);
  CrmService.redisClient = getRedisClient(environment.redisHost, environment.redisHostPort);
  CrmService.s3Bucket = getAWSS3Bucket(environment.s3AccessKey, environment.s3Secret);
};
