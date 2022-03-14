import { getAccessTokenRedis, PlusmarService, verifyToken } from '@reactor-room/itopplus-services-lib';

export const getStorageAccount = async (accessToken: string): Promise<string> => {
  const userToken = verifyToken(<string>accessToken).value;
  const payload = await getAccessTokenRedis(userToken, PlusmarService.redisClient);
  return payload?.subscription?.storageAccount;
};
