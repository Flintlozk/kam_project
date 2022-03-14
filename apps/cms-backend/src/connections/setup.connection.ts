import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { PoolConfig } from 'pg';
import { environment } from '../environments/environment';
import { getAWSS3Bucket } from './minio.connection';
import * as mongo from './mongo.connection';
import { PGConnection, PGConnectionWrite } from './postgres.connection';
import { getRedisClient } from './redis.connection';

export const setupConnection = async (): Promise<void> => {
  PlusmarService.mongoConnector = await mongo.connect(environment.mongoDB);
  console.log('MONGO 1 Connected');
  PlusmarService.mongoAutodigiConnector = await mongo.connectAutodigiMongo(environment.mongoAutodigiDB);
  console.log('MONGO 2 Connected');
  if (environment.production) {
    PlusmarService.mongoAutodigiCosmosConnector = await mongo.connectAutodigiMongo(environment.mongoAutodigiDB);
    console.log('MONGO 2C Connected');
  }

  PlusmarService.readerClient = await PGConnection.connect({
    connectionString: environment.PG_URL_READ,
    max: environment.PG_MAX_CON_READ,
  } as PoolConfig);

  console.log('PG(R) Connected ');
  PlusmarService.writerClient = await PGConnectionWrite.connect({
    connectionString: environment.PG_URL_WRITE,
    max: environment.PG_MAX_CON_WRITE,
  } as PoolConfig);
  console.log('PG(W) Connected ');

  PlusmarService.redisClient = getRedisClient(environment.cms.redisHost, environment.cms.redisPort);
  //PlusmarService.redisStoreClient = getRedisStoreClient(environment.cms.redisHost, environment.cms.redisPort);
  PlusmarService.minioClient = getAWSS3Bucket(environment.s3AccessKey, environment.s3Secret);
  PlusmarService.environment = environment;
};
