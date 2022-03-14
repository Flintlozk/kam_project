import { ILineWebhook } from '@reactor-room/itopplus-model-lib';
import { LineListenerService } from '../../services/line/listener.service';
import { pubsubHandler } from '../pubsub-handler';
class Listener {
  public static instance;
  public static lineListenerService: LineListenerService;

  public static getInstance() {
    if (!Listener.instance) Listener.instance = new Listener();
    return Listener.instance;
  }

  constructor() {
    Listener.lineListenerService = new LineListenerService();
  }

  async lineListenHandler(webhook: ILineWebhook): Promise<boolean> {
    return await Listener.lineListenerService.listen(webhook);
  }
}

// export const listener: Listener = Listener.getInstance();
const listener: Listener = new Listener();
export const lineListenController = {
  lineListenHandler: pubsubHandler({
    handler: listener.lineListenHandler,
  }),
};
