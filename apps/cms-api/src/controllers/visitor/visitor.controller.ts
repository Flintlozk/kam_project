import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { SetVisitor, VisitorResponse } from '../../validate/visitor.model';
import { validateSetVisitor, validateVisitorResponse } from '../../schema/visitor/visitor.schema';
import { visitorAsyncIterator, VisitorService } from '../../services/visitor.service';

class Visitor {
  public static instance: Visitor;
  public static visitorService: VisitorService;

  public static getInstance() {
    if (!Visitor.instance) Visitor.instance = new Visitor();
    return Visitor.instance;
  }

  constructor() {
    Visitor.visitorService = new VisitorService();
  }
  async getVisitorHandler(parent, args: VisitorResponse, context: IGQLContext): Promise<VisitorResponse> {
    const { pageID } = args;
    const result = await Visitor.visitorService.getVisitor(pageID);
    return result;
  }
  async setVisitorHandler(parent, args: SetVisitor, context: IGQLContext): Promise<VisitorResponse> {
    const { pageID, visitor } = args;
    validateSetVisitor({ pageID, visitor });
    const result = await Visitor.visitorService.setVisitor(pageID, visitor);
    return result;
  }
}

const visitor: Visitor = Visitor.getInstance();
export const visitorResolver = {
  Query: {
    getVisitor: graphQLHandler({
      handler: visitor.getVisitorHandler,
      validator: validateVisitorResponse,
    }),
  },
  Mutation: {
    setVisitor: graphQLHandler({
      handler: visitor.setVisitorHandler,
      validator: validateVisitorResponse,
    }),
  },
  Subscription: {
    visitorSubscription: {
      subscribe: () => visitorAsyncIterator,
    },
  },
};
