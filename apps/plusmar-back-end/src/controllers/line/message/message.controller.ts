import { IHTTPResult } from '@reactor-room/model-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { EnumAuthScope, IGQLContext, IMessageModel } from '@reactor-room/itopplus-model-lib';
import { LineMessageService } from '@reactor-room/itopplus-services-lib';
import { validateResponseHTTPObject } from 'apps/plusmar-back-end/src/schema/common';
import { validateGetMessagesByPSID } from '../../../schema/facebook/message';
import { graphQLHandler } from '../../graphql-handler';
@requireScope([EnumAuthScope.SOCIAL])
class LineMessage {
  public static instance;
  public static lineMessageService = new LineMessageService();
  public static getInstance() {
    if (!LineMessage.instance) LineMessage.instance = new LineMessage();
    return LineMessage.instance;
  }

  constructor() {
    LineMessage.lineMessageService = new LineMessageService();
  }

  async sendLineMessageHandler(parent, args, context: IGQLContext): Promise<IMessageModel> {
    return await LineMessage.lineMessageService.sendLineMessageFromChatbox(args.message, context.payload);
  }
  async lineUploadHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID, subscriptionID, page } = context.payload;
    return await LineMessage.lineMessageService.lineUpload(pageID, page.uuid, args.lineUploadInput, subscriptionID);
  }
}

const lineMessage: LineMessage = new LineMessage();
export const lineMessageResolver = {
  Mutation: {
    sendLineMessage: graphQLHandler({
      handler: lineMessage.sendLineMessageHandler,
      validator: validateGetMessagesByPSID,
    }),
    lineUpload: graphQLHandler({
      handler: lineMessage.lineUploadHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
