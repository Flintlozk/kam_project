import { IPageWebhookPatternPayload, IPageWebhookQuickpayPayload } from '@reactor-room/itopplus-model-lib';
import { OpenAPIListenerService } from '../../services/openapi/listener.service';
import { pubsubHandler } from '../pubsub-handler';
class Listener {
  public static instance;
  public static openAPIListenerService: OpenAPIListenerService;

  public static getInstance() {
    if (!Listener.instance) Listener.instance = new Listener();
    return Listener.instance;
  }

  constructor() {
    Listener.openAPIListenerService = new OpenAPIListenerService();
  }

  async openApiListenHandler(payload: IPageWebhookPatternPayload | IPageWebhookQuickpayPayload): Promise<boolean> {
    return await Listener.openAPIListenerService.listen(payload);
  }
}

const listener: Listener = new Listener();
export const openApiListenController = {
  openApiListenHandler: pubsubHandler({
    handler: listener.openApiListenHandler,
  }),
};
