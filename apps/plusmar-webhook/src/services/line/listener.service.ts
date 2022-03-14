import { ILineWebhook } from '@reactor-room/itopplus-model-lib';
import { LineMessageService } from './message.service';

enum WEBHOOK_EVENT_TYPE {
  MESSAGE = 'message',
  FOLLOW = 'follow',
  UNFOLLOW = 'unfollow',
  JOIN = 'join',
  LEAVE = 'leave',
  POSTBACK = 'postback',
  MEMBER_LEFT = 'memberLeft',
  UNSEND = 'unsend',
}

export class LineListenerService {
  private lineMessageService = new LineMessageService();

  listen = async (webhook: ILineWebhook): Promise<boolean> => {
    const eventType = webhook.events[0].type;
    if (webhook.events.length > 0) {
      switch (eventType) {
        case WEBHOOK_EVENT_TYPE.MESSAGE:
          return await this.checkTypeMessage(webhook);
        case WEBHOOK_EVENT_TYPE.FOLLOW:
          return await this.manageNewFollower(webhook);
        case WEBHOOK_EVENT_TYPE.UNFOLLOW:
          break;
        case WEBHOOK_EVENT_TYPE.JOIN:
          break;
        case WEBHOOK_EVENT_TYPE.LEAVE:
          break;
        case WEBHOOK_EVENT_TYPE.MEMBER_LEFT:
          // const ex = {
          //   type: 'memberLeft',
          //   left: { members: [{ type: 'user', userId: 'Uf5366de48a05b28cc4e8fa1fcda29f2c' }] },
          //   timestamp: 1627993379742,
          //   source: { type: 'group', groupId: 'C6b56f9ce127b4ffc680e6cc1bf09e5b1' },
          //   mode: 'active',
          // };
          break;
        case WEBHOOK_EVENT_TYPE.UNSEND:
          // const ex = {
          //   type: 'unsend',
          //   unsend: { messageId: '14665770009256' },
          //   timestamp: 1630397533126,
          //   source: { type: 'room', roomId: 'Rc851cb3518049e2dd6bf3d9f60274d4a', userId: 'Ue192f1e07efc44d97654a9644b5bb3e3' },
          //   mode: 'active',
          // };
          break;
        case WEBHOOK_EVENT_TYPE.POSTBACK:
          webhook.events[0].postback.data;
          break;
        default:
          console.log('unhandles eventType ', eventType);
        // throw new Error(`Unknown event: ${JSON.stringify(webhook.events[0])}`);
      }
    }
    return true;
  };

  checkTypeMessage = async (webhook: ILineWebhook): Promise<boolean> => {
    return await this.lineMessageService.handleAPIMessageEvent(webhook);
  };

  manageNewFollower = async (webhook: ILineWebhook): Promise<boolean> => {
    return await this.lineMessageService.handleNewFollower(webhook);
  };
}
