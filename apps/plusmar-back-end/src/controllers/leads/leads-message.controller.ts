import { Request } from 'express';
import { expressHandler } from '../express-handler';
import { LeadsPostbackMessageService } from '@reactor-room/itopplus-services-lib';

class LeadsMessage {
  public static instance;
  public static leadsPostbackMessageService: LeadsPostbackMessageService;

  public static getInstance() {
    if (!LeadsMessage.instance) LeadsMessage.instance = new LeadsMessage();
    return LeadsMessage.instance;
  }

  constructor() {
    LeadsMessage.leadsPostbackMessageService = new LeadsPostbackMessageService();
  }

  async handlePostbackMessages(req: Request) {
    return await LeadsMessage.leadsPostbackMessageService.handlePostbackMessages(req);
  }
}

const leadsMessage: LeadsMessage = new LeadsMessage();

export const leadsMessageController = {
  handlePostbackMessages: expressHandler({
    handler: leadsMessage.handlePostbackMessages,
    validator: (x: any) => x,
  }),
};
