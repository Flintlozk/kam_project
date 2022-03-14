import { IPayload } from '@reactor-room/crm-models-lib';
import { CrmService } from '../../services/crmservice.class';

export function getAccessTokenRedis(userIDKeys: string): Promise<IPayload> {
  return new Promise((resolve, reject) => {
    const client = CrmService.redisClient;
    client.get(userIDKeys, (err, val) => {
      if (err) reject(err);
      else {
        resolve(JSON.parse(val));
      }
    });
  });
}
