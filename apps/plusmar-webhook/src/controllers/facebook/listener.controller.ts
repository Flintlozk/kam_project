import { FacebookListenerService } from '../../services/facebook/listener.service';
import { pubsubHandler } from '../pubsub-handler';
class Listener {
  public static instance;
  public static facebookListenerService: FacebookListenerService;

  public static getInstance() {
    if (!Listener.instance) Listener.instance = new Listener();
    return Listener.instance;
  }

  constructor() {
    Listener.facebookListenerService = new FacebookListenerService();
  }

  async facebookListenHandler(webhook): Promise<boolean> {
    return await Listener.facebookListenerService.listen(webhook);
  }
}

const listener: Listener = new Listener();
export const facebookListenController = {
  facebookListenHandler: pubsubHandler({
    handler: listener.facebookListenHandler,
  }),
};
