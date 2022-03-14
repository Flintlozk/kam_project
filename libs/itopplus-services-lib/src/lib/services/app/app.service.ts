import { deleteSessionValue, getKeysFromSessionByPass, setSessionValue } from '@reactor-room/itopplus-back-end-helpers';
import { EnumCloudMessageQueueAttribute } from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { PlusmarService } from '../plusmarservice.class';

export class ApplicationService {
  constructor() {}

  getCloudMessageKey(pageID: number): string {
    return `C_QUEUE:${pageID}`;
  }

  async getCloudMessageQueue(pageID: number): Promise<{ bypass: boolean; data: EnumCloudMessageQueueAttribute }> {
    const redisClient = PlusmarService.redisStoreClient;
    const redisKey = this.getCloudMessageKey(pageID);

    const queue = await getKeysFromSessionByPass<EnumCloudMessageQueueAttribute>(redisClient, redisKey);
    if (isEmpty(queue.data)) {
      this.setCloudMessageQueue(pageID, EnumCloudMessageQueueAttribute.RUNNING);
      const queue2 = await getKeysFromSessionByPass<EnumCloudMessageQueueAttribute>(redisClient, redisKey);
      return { bypass: true, data: queue2.data };
    }

    return queue;
  }
  setCloudMessageQueue(pageID: number, attribute: EnumCloudMessageQueueAttribute): void {
    // RUNNING , TIMEOUT , SUCCESS
    const redisClient = PlusmarService.redisStoreClient;
    const redisKey = this.getCloudMessageKey(pageID);
    setSessionValue(redisClient, redisKey, attribute);
  }

  deleteCloudMessageQueue(pageID: number): void {
    // RUNNING , TIMEOUT , SUCCESS
    const redisClient = PlusmarService.redisStoreClient;
    const redisKey = this.getCloudMessageKey(pageID);
    deleteSessionValue(redisClient, redisKey);
  }
}
