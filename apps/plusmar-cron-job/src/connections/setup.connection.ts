import { environmentLib } from '@reactor-room/environment-services-backend';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { PoolConfig } from 'pg';
import { environment } from '../environments/environment';
import * as mongo from './mongo.connection';
import { connectToServer } from './nats.connection';
import { PGConnection, PGConnectionWrite } from './postgres.connection';
import { getRedisClient } from './redis.connection';

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
  PlusmarService.environment = environmentLib;
  PlusmarService.redisClient = getRedisClient(environment.redisHost, environment.redisHostPort);

  // await getNatsSubscription(PlusmarService.natsConnection, 'stream01', 10);

  // setTimeout(async () => {
  //   for (let j = 0; j < 10; j++) {
  //     const random = Math.floor(Math.random() * (4 - 1) + 1);
  //     await onWaitFor(random);
  //     void startNatsExample(PlusmarService.natsConnection, `stream01`, 1, j);
  //   }
  // }, 1000);
};
