import { IGQLContext } from '@reactor-room/itopplus-model-lib';

export const removeBearerText = (fulltoken: string): string => {
  return fulltoken.replace('Bearer ', '');
};

export const getFBToken = (context: IGQLContext): string => {
  return context.payload?.page?.option?.access_token;
};
