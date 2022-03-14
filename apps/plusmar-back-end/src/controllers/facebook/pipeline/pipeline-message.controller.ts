import { AudiencePlatformType } from '@reactor-room/model-lib';
import { EnumAuthScope, IGQLContext, InputSendFormPayloadHandler } from '@reactor-room/itopplus-model-lib';
import { PipelineMessageService, PipelineOrderMessageService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateGetMessagesByPSID } from '../../../schema/facebook/message';
import { validateRequestSendFormPayload, validateResponseSendFormPayload } from '../../../schema/facebook/pipeline/pipeline.schema';
import { graphQLHandler } from '../../graphql-handler';
@requireScope([EnumAuthScope.SOCIAL])
class FacebookMessagePipeline {
  public static instance;
  public static pipelineMessageService: PipelineMessageService;
  public static pipelineOrderMessageService: PipelineOrderMessageService;
  public static getInstance() {
    if (!FacebookMessagePipeline.instance) FacebookMessagePipeline.instance = new FacebookMessagePipeline();
    return FacebookMessagePipeline.instance;
  }

  constructor() {
    FacebookMessagePipeline.pipelineMessageService = new PipelineMessageService();
    FacebookMessagePipeline.pipelineOrderMessageService = new PipelineOrderMessageService();
  }

  async sendPayloadHandler(parent, args, context: IGQLContext) {
    const { audienceID, psid, step, platform } = args;
    return await FacebookMessagePipeline.pipelineOrderMessageService.sendOrderPayload(context.payload.pageID, audienceID, step, platform, context.payload.subscriptionID);
  }

  async sendFormPayloadHandler(parent, args: InputSendFormPayloadHandler, context: IGQLContext) {
    const { audienceID, psid, formID } = await validateRequestSendFormPayload(args);
    return await FacebookMessagePipeline.pipelineMessageService.sendFormPayload(context.payload, audienceID, psid, formID, AudiencePlatformType.FACEBOOKFANPAGE);
  }
}

const facebookMessagePipeline: FacebookMessagePipeline = FacebookMessagePipeline.getInstance();
export const facebookMessagePipelineResolver = {
  Mutation: {
    sendPayload: graphQLHandler({
      handler: facebookMessagePipeline.sendPayloadHandler,
      validator: validateGetMessagesByPSID,
    }),
    sendFormPayload: graphQLHandler({
      handler: facebookMessagePipeline.sendFormPayloadHandler,
      validator: validateResponseSendFormPayload,
    }),
  },
};
