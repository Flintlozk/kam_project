import { PubSub } from '@google-cloud/pubsub';

export class MarketplaceService {
  publishMessage(payload: { cron_msg: string }, topicName: string): Promise<void> {
    return new Promise((resolve) => {
      const dataJson = JSON.stringify(payload);
      const data = Buffer.from(dataJson);
      const connection = new PubSub();
      connection
        .topic(topicName, {
          batching: {
            maxMessages: 100,
          },
        })
        .publishMessage({ data })
        .then((messageId) => {
          console.log(`Message ${messageId} published.`);
          resolve();
        })
        .catch((e) => {
          // Move here because if reaven is gone don't make system failed until this catch.
          console.log(e);
          resolve();
        });
    });
  }

  updateMarketPlaceInventory(): void {
    void this.publishMessage({ cron_msg: 'UPDATE_MARKETPLACE_INVENTORY' }, 'plusmar-staging-marketplace7');

    setInterval(() => {
      this.updateMarketPlaceInventory();
    }, 6000000);
  }
}
