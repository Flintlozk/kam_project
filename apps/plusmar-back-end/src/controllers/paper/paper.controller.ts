import { requireScope } from '@reactor-room/itopplus-services-lib';
import { EnumAuthScope, IGeneratePaperPDFResponse, IGQLContext, IInputPaperSetting } from '@reactor-room/itopplus-model-lib';
import { PaperService, PlusmarService } from '@reactor-room/itopplus-services-lib';
import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';

@requireScope([EnumAuthScope.SOCIAL])
class PaperController {
  public static instance;
  public static paperService: PaperService;

  constructor() {
    PaperController.paperService = new PaperService();
  }
  public static getInstance() {
    if (!PaperController.instance) PaperController.instance = new PaperController();
    return PaperController.instance;
  }

  async generatePaperPDFHandler(parent, args: { orderUUID: string; paperSetting: IInputPaperSetting }, context: IGQLContext): Promise<IGeneratePaperPDFResponse> {
    const pageUUID = context?.payload?.page?.uuid;
    const subscriptionID = context.payload.subscriptionID;
    const pageID = context.payload.pageID;
    const { orderUUID, paperSetting } = args;
    return await PaperController.paperService.generatePaperPDF(pageID, pageUUID, orderUUID, paperSetting, subscriptionID);
  }
}

const paperControllerInstance: PaperController = PaperController.getInstance();

export const paperResolver = {
  Query: {
    generatePaperPDF: graphQLHandler({
      handler: paperControllerInstance.generatePaperPDFHandler,
      validator: (x) => x,
    }),
  },
};
