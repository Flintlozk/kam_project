import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { environment } from '../environments/environment';
import { getRedisClient } from './redis.connection';

export const setupConnection = async (): Promise<void> => {
  PlusmarService.redisClient = getRedisClient(environment.cms.redisGeneratorHost, environment.cms.redisGeneratorPort);
  PlusmarService.environment = environment;
};
