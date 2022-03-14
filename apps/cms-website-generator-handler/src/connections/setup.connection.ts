import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { environment } from '../environments/environment';
import * as mongo from './mongo.connection';
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
  PlusmarService.redisClient = getRedisClient(environment.cms.redisGeneratorHost, environment.cms.redisGeneratorPort);
  console.log('REDIS Connected');
  PlusmarService.environment = environment;
};
