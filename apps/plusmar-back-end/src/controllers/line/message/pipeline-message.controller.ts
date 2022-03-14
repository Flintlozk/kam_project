import { AudiencePlatformType } from '@reactor-room/model-lib';
import { EnumAuthScope, IGQLContext, InputSendFormPayloadHandler, IMessageModel } from '@reactor-room/itopplus-model-lib';
import { PipelineMessageService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateRequestSendFormLinePayload, validateResponseSendFormPayload } from '../../../schema/facebook/pipeline/pipeline.schema';
import { graphQLHandler } from '../../graphql-handler';
@requireScope([EnumAuthScope.SOCIAL])
class LineMessagePipeline {
  public static instance;
  public static pipelineMessageService: PipelineMessageService;
  public static getInstance() {
    if (!LineMessagePipeline.instance) LineMessagePipeline.instance = new LineMessagePipeline();
    return LineMessagePipeline.instance;
  }

  constructor() {
    LineMessagePipeline.pipelineMessageService = new PipelineMessageService();
  }

  async sendFormLinePayloadHandler(parent, args: InputSendFormPayloadHandler, context: IGQLContext): Promise<IMessageModel> {
    const { audienceID, formID } = await validateRequestSendFormLinePayload(args);
    return await LineMessagePipeline.pipelineMessageService.sendFormPayload(context.payload, audienceID, null, formID, AudiencePlatformType.LINEOA);
  }
}

const lineMessagePipeline: LineMessagePipeline = LineMessagePipeline.getInstance();
export const lineMessagePipelineResolver = {
  Mutation: {
    sendFormLinePayload: graphQLHandler({
      handler: lineMessagePipeline.sendFormLinePayloadHandler,
      validator: validateResponseSendFormPayload,
    }),
  },
};
