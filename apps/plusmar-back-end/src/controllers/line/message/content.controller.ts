import { LineMessageService } from '@reactor-room/itopplus-services-lib';
import { Request } from 'express';
class LineClientContentMessage {
  public static instance;
  public static lineMessageService: LineMessageService;

  public static getInstance() {
    if (!LineClientContentMessage.instance) LineClientContentMessage.instance = new LineClientContentMessage();
    return LineClientContentMessage.instance;
  }

  constructor() {
    LineClientContentMessage.lineMessageService = new LineMessageService();
  }

  async getLineContentByPageAndMessageIDHandler(req: Request) {
    const { pageID, audienceID, messageID } = req.params;
    return await LineClientContentMessage.lineMessageService.getLineContentByPageAndMessageID(pageID, audienceID, messageID);
  }

  async getLineContentByPageAndMessageIDByUUIDHandler(req: Request) {
    const { UUID, audienceID, messageID } = req.params;
    return await LineClientContentMessage.lineMessageService.getLineContentByPageAndMessageIDByUUID(UUID, audienceID, messageID);
  }
}

const lineClientContentMessage: LineClientContentMessage = new LineClientContentMessage();
export const lineClientContentMessageController = {
  getLineContentByPageAndMessageID: lineClientContentMessage.getLineContentByPageAndMessageIDHandler,
  getLineContentByPageAndMessageIDByUUID: lineClientContentMessage.getLineContentByPageAndMessageIDByUUIDHandler,
};
