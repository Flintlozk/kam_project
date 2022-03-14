import { EnumAuthScope, IAudience, IAudienceStep, IAudienceStepInput, IGQLContext, IIDInterface } from '@reactor-room/itopplus-model-lib';
import { AudienceStepService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateAudienceHistoryResponse, validateRequestGetStepInputValidate } from '../../schema/audience';
import { validateIDNumberObject } from '../../schema/common';
import { validateResponseCustomer } from '../../schema/customer';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
class AudienceHistory {
  public static instance;
  public static audienceStepService: AudienceStepService;

  public static getInstance() {
    if (!AudienceHistory.instance) AudienceHistory.instance = new AudienceHistory();
    return AudienceHistory.instance;
  }

  constructor() {
    AudienceHistory.audienceStepService = new AudienceStepService();
  }

  async getStepsHandler(parent, args, context: IGQLContext): Promise<IAudience> {
    const { pageID } = context?.payload || {};
    const { audienceID } = await validateRequestGetStepInputValidate(args);
    return await AudienceHistory.audienceStepService.getSteps(audienceID, pageID);
  }

  async createOrUpdateStepHandler(parent, args, context: IGQLContext): Promise<IAudience> {
    const { pageID: page_id, userID: user_id } = context.payload;
    const step: IAudienceStepInput = Object.assign({
      audience_id: args.audienceID,
      page_id,
      user_id,
    });
    return await AudienceHistory.audienceStepService.createOrUpdateStep(step);
  }

  async backToPreviousStepHandler(parent, args, context: IGQLContext): Promise<IAudience> {
    const { audienceID } = validateRequestGetStepInputValidate(args);
    const { pageID: page_id, userID: user_id } = context.payload || {};
    const step: IAudienceStepInput = Object.assign({
      audience_id: audienceID,
      page_id,
      user_id,
    });
    return await AudienceHistory.audienceStepService.backToPreviousStep(step);
  }

  async getAudienceHistoryByAudienceIDHandler(parent, args: IIDInterface, context: IGQLContext): Promise<IAudienceStep[]> {
    const { id } = validateIDNumberObject(args);
    const { pageID } = context.payload || {};
    const data = await AudienceHistory.audienceStepService.getAudienceHistoryByAudienceID(id, pageID);
    return data;
  }
}

const audienceHistory: AudienceHistory = AudienceHistory.getInstance();
export const audienceHistoryResolver = {
  Query: {
    getSteps: graphQLHandler({
      handler: audienceHistory.getStepsHandler,
      validator: validateResponseCustomer,
    }),
    getAudienceHistoryByAudienceID: graphQLHandler({
      handler: audienceHistory.getAudienceHistoryByAudienceIDHandler,
      validator: validateAudienceHistoryResponse,
    }),
  },
  Mutation: {
    createOrUpdate: graphQLHandler({
      handler: audienceHistory.createOrUpdateStepHandler,
      validator: validateResponseCustomer,
    }),
    backToPreviousStep: graphQLHandler({
      handler: audienceHistory.backToPreviousStepHandler,
      validator: validateResponseCustomer,
    }),
  },
};
