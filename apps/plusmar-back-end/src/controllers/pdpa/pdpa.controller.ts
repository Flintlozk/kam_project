import { requireScope } from '@reactor-room/itopplus-services-lib';
import { EnumAuthScope, IGQLContext, IPagePrivacyPolicyOptions, IPageTermsAndConditionOptions } from '@reactor-room/itopplus-model-lib';
import { PDPAService } from '@reactor-room/itopplus-services-lib';
import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
@requireScope([EnumAuthScope.SOCIAL])
class PDPAController {
  public static instance;
  public static PDPAService: PDPAService;
  public static getInstance() {
    if (!PDPAController.instance) PDPAController.instance = new PDPAController();
    return PDPAController.instance;
  }
  constructor() {
    PDPAController.PDPAService = new PDPAService();
  }

  async setTermsAndConditionHandler(parent, args: { input: IPageTermsAndConditionOptions }, context: IGQLContext): Promise<boolean> {
    return await PDPAController.PDPAService.setTermsAndCondition(context.payload.pageID, args.input);
  }
  async setPrivacyPolicyHandler(parent, args: { input: IPagePrivacyPolicyOptions }, context: IGQLContext): Promise<boolean> {
    return await PDPAController.PDPAService.setPrivacyPolicy(context.payload.pageID, args.input);
  }
}

const controller: PDPAController = PDPAController.getInstance();

export const PDPAResolver = {
  Mutation: {
    setTermsAndCondition: graphQLHandler({
      handler: controller.setTermsAndConditionHandler,
      validator: (x) => x,
    }),
    setPrivacyPolicy: graphQLHandler({
      handler: controller.setPrivacyPolicyHandler,
      validator: (x) => x,
    }),
  },
};
