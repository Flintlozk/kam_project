import {
  PurchaseOrderPostbackButtonService,
  PurchaseOrderPostbackMessageService,
  PurchaseOrderTransactionCheckerService,
  Payment2C2PService,
  PurchaseOrderOmisePostbackMessageService,
} from '@reactor-room/itopplus-services-lib';
import { Request, Response } from 'express';
import { expressHandler, expressHandlerRedirect } from '../express-handler';

class PurchaseOrderMessage {
  public static instance;
  public static purchaseOrderPostbackButtonService: PurchaseOrderPostbackButtonService;
  public static purchaseOrderPostbackMessageService: PurchaseOrderPostbackMessageService;
  public static purchaseOrderOmisePostbackMessageService: PurchaseOrderOmisePostbackMessageService;
  public static purchaseOrderTransactionCheckerService: PurchaseOrderTransactionCheckerService;
  public static payment2C2PService: Payment2C2PService;

  public static getInstance() {
    if (!PurchaseOrderMessage.instance) PurchaseOrderMessage.instance = new PurchaseOrderMessage();
    return PurchaseOrderMessage.instance;
  }

  constructor() {
    PurchaseOrderMessage.purchaseOrderPostbackButtonService = new PurchaseOrderPostbackButtonService();
    PurchaseOrderMessage.purchaseOrderPostbackMessageService = new PurchaseOrderPostbackMessageService();
    PurchaseOrderMessage.purchaseOrderTransactionCheckerService = new PurchaseOrderTransactionCheckerService();
    PurchaseOrderMessage.payment2C2PService = new Payment2C2PService();
    PurchaseOrderMessage.purchaseOrderOmisePostbackMessageService = new PurchaseOrderOmisePostbackMessageService();
  }

  async handlePostbackMessagesHandler(req: Request, res: Response) {
    return await PurchaseOrderMessage.purchaseOrderPostbackMessageService.handlePostbackMessages(req, res);
  }
  // async handleTransactionCheckerHandler(req: Request, res: Response) {
  //   return await PurchaseOrderMessage.purchaseOrderTransactionCheckerService.handleTransactionChecker(req, res);
  // }
  async handlePaypalCheckInitiatorHandler(req: Request, res: Response) {
    return await PurchaseOrderMessage.purchaseOrderTransactionCheckerService.handlePaypalCheckInitiator(req, res);
  }

  async handle2C2PInitiatorHandler(req: Request, res: Response) {
    return await PurchaseOrderMessage.purchaseOrderTransactionCheckerService.handle2C2PInitiator(req, res);
  }
  async handle2C2PRedirectHandler(req: Request): Promise<string> {
    return await PurchaseOrderMessage.purchaseOrderTransactionCheckerService.handle2C2PRedirect(req);
  }
  async handleOmiseRedirectHandler(req: Request): Promise<string> {
    return await PurchaseOrderMessage.purchaseOrderTransactionCheckerService.handleOmiseInternetBankingRedirect(req);
  }

  async handleOmiseInitiatorHandler(req: Request, res: Response) {
    return await PurchaseOrderMessage.purchaseOrderTransactionCheckerService.handleOmiseInitiator(req, res);
  }

  async handlePostbackOmiseMessagesHandler(req: Request, res: Response) {
    return await PurchaseOrderMessage.purchaseOrderOmisePostbackMessageService.handlePostbackMessages(req, res);
  }
}

const purchaseOrderMessage: PurchaseOrderMessage = new PurchaseOrderMessage();
export const purchaseOrderMessageController = {
  handlePostbackMessages: expressHandler({
    handler: purchaseOrderMessage.handlePostbackMessagesHandler,
    validator: (x: any) => x,
  }),
  handlePostbackOmiseMessages: expressHandler({
    handler: purchaseOrderMessage.handlePostbackOmiseMessagesHandler,
    validator: (x: any) => x,
  }),
  // handleTransactionChecker: expressHandler({
  //   handler: purchaseOrderMessage.handleTransactionCheckerHandler,
  //   validator: (x: any) => x,
  // }),
  handlePaypalCheckInitiator: expressHandler({
    handler: purchaseOrderMessage.handlePaypalCheckInitiatorHandler,
    validator: (x: any) => x,
  }),
  handle2C2PInitiator: expressHandler({
    handler: purchaseOrderMessage.handle2C2PInitiatorHandler,
    validator: (x: any) => x,
  }),
  handle2C2PRedirect: expressHandlerRedirect({
    handler: purchaseOrderMessage.handle2C2PRedirectHandler,
    validator: (x: any) => x,
  }),
  handleOmiseRedirectHandler: expressHandlerRedirect({
    handler: purchaseOrderMessage.handleOmiseRedirectHandler,
    validator: (x: any) => x,
  }),
  handleOmiseInitiator: expressHandler({
    handler: purchaseOrderMessage.handleOmiseInitiatorHandler,
    validator: (x: any) => x,
  }),
};
