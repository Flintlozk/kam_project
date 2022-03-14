import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PoolConfig } from 'pg';
import { environment } from '../environments/environment';
import { getAWSS3Bucket } from './minio.connection';
import * as mongo from './mongo.connection';
import { connectToServer } from './nats.connection';
import { PGConnection, PGConnectionWrite } from './postgres.connection';
import { getRedisClient, getRedisStoreClient } from './redis.connection';

export const setupConnection = async (): Promise<void> => {
  await mongo.connect(environment.mongoDB);
  PlusmarService.natsConnection = await connectToServer(environment.NATSServer);
  PlusmarService.readerClient = await PGConnection.connect({
    connectionString: environment.PG_URL_READ,
    max: environment.PG_MAX_CON_READ,
  } as PoolConfig);
  PlusmarService.writerClient = await PGConnectionWrite.connect({
    connectionString: environment.PG_URL_WRITE,
    max: environment.PG_MAX_CON_WRITE,
  } as PoolConfig);

  PlusmarService.redisClient = getRedisClient(environment.redisHost, environment.redisHostPort);
  PlusmarService.redisStoreClient = getRedisStoreClient(environment.redisStore, environment.redisStorePort);

  const pubsub = new RedisPubSub({
    connection: {
      host: environment.redisSubscription.replace('redis://', ''),
      port: environment.redisSubscriptionPort,
      retry_strategy: (options) => Math.max(options.attempt * 100, 3000),
    },
  });
  PlusmarService.pubsub = pubsub;
  PlusmarService.minioClient = getAWSS3Bucket(environment.s3AccessKey, environment.s3Secret);
  PlusmarService.environment = environment;
};
