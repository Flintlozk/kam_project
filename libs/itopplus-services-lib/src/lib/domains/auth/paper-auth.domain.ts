import { EnumAuthError, IPaperParam } from '@reactor-room/itopplus-model-lib';
import * as jwt from 'jsonwebtoken';

export const paperPayloadArchiver = (value: string, key: string): string => {
  return jwt.sign(value, key);
};

export const paperPayloadExtractor = (token: string, key: string): Promise<IPaperParam> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, key, (err, decoded: IPaperParam) => {
      if (err) {
        reject(EnumAuthError.INVALID_TOKEN);
      } else {
        resolve(decoded);
      }
    });
  });
};
