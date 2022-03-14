import { OpenAPIService } from '@reactor-room/itopplus-services-lib';
import { expressHandler } from '../express-handler';
import { validateRequesteSendLineMessageFromOpenAPIObject } from '../../schema/line';
import { requireAPIKey } from '../../domains/auth.domain';

import { Request } from 'express';
class OpenAPIMessage {
  public static openAPIService: OpenAPIService;

  sendLineMessageOpenAPI = expressHandler({ handler: this.sendLineMessageHandler, validator: (x: any) => x });

  constructor() {
    OpenAPIMessage.openAPIService = new OpenAPIService();
  }

  @requireAPIKey
  async sendLineMessageHandler(request: Request) {
    const param = validateRequesteSendLineMessageFromOpenAPIObject(request.body);
    return await OpenAPIMessage.openAPIService.sendLineMessageOpenAPI(param);
  }
}

export const openAPIMessageController = new OpenAPIMessage();
