import { Pool } from 'pg';
import { RedisClient } from 'redis';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { IEnvironment } from '@reactor-room/environment-services-backend';
import * as Minio from 'minio';
import { NatsConnection } from 'nats';
import * as mongoose from 'mongoose';

export class PlusmarService {
  public static readerClient: Pool;
  public static writerClient: Pool;
  public static mongoConnector: typeof mongoose;

  public static mongoAutodigiConnector: mongoose.Connection;
  public static mongoAutodigiCosmosConnector: mongoose.Connection;

  public static redisClient: RedisClient;
  public static redisStoreClient: RedisClient;
  public static minioClient: Minio.Client;
  // eslint-disable-next-line
  public static environment: IEnvironment;
  public static pubsub: RedisPubSub;

  public static natsConnection: NatsConnection;
}
