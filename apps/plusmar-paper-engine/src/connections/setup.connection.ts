import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { PoolConfig } from 'pg';
import { environment } from '../environments/environment';
import * as mongo from './mongo.connection';
import { PGConnection, PGConnectionWrite } from './postgres.connection';
import { getRedisClient } from './redis.connection';
import { getAWSS3Bucket } from './minio.connection';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { connectToServer } from './nats.connection';

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
