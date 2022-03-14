import { IProductCatalogSession, ISalePageCartPayload, WebhookProductCatalogCartTemplateQueries, WebhookProductCatalogTemplateQueries } from '@reactor-room/itopplus-model-lib';
import {
  ProductCatalogService,
  ViewRenderLeadService,
  ViewRenderPDPAService,
  ViewRenderPurchaseTemplateService,
  ViewRenderQuotationService,
} from '@reactor-room/itopplus-services-lib';
import { Request, Response } from 'express';
import addressJson from '../../assets/static/address-autocomplete.json';
import { validateRequestCatalogAuth, validateRequestCatalogPage } from '../../schema/product/product-catalog.schema';
import { expressHandlerRender } from '../express-handler';

class ViewRender {
  public static instance;
  public static viewRenderPDPAService: ViewRenderPDPAService;
  public static viewRenderLeadService: ViewRenderLeadService;
  public static viewRenderPurchaseTemplateService: ViewRenderPurchaseTemplateService;
  public static viewRenderQuotationService: ViewRenderQuotationService;
  public static productCatalogService: ProductCatalogService;

  public static getInstance() {
    if (!ViewRender.instance) ViewRender.instance = new ViewRender();
    return ViewRender.instance;
  }

  constructor() {
    ViewRender.viewRenderPDPAService = new ViewRenderPDPAService();
    ViewRender.viewRenderLeadService = new ViewRenderLeadService();
    ViewRender.viewRenderPurchaseTemplateService = new ViewRenderPurchaseTemplateService(addressJson);
    ViewRender.viewRenderQuotationService = new ViewRenderQuotationService();
    ViewRender.productCatalogService = new ProductCatalogService();
  }

  async handlePurchaseTemplates(req: Request, res: Response) {
    return await ViewRender.viewRenderPurchaseTemplateService.handlePurchaseTemplates(req, res);
  }
  async handlePurchaseRedirect(req: Request, res: Response) {
    return await ViewRender.viewRenderPurchaseTemplateService.handlePurchaseRedirect(req, res);
  }
  async handleLeadTemplates(req: Request, res: Response) {
    return await ViewRender.viewRenderLeadService.handleLeadTemplates(req, res);
  }
  async handleQuotationTemplates(req: Request, res: Response) {
    return await ViewRender.viewRenderQuotationService.handleQuotationTemplates(req, res);
  }
  async handleLineWebviewRoute(req: Request, res: Response) {
    return await ViewRender.viewRenderLeadService.handleLineWebviewRoute(req, res);
  }
  async handlePDPADataUse(req: Request, res: Response) {
    return await ViewRender.viewRenderPDPAService.handlePDPATemplates(req, res, 'datause');
  }
  async handlePDPAPrivacy(req: Request, res: Response) {
    return await ViewRender.viewRenderPDPAService.handlePDPATemplates(req, res, 'terms');
  }

  async handlePurchaseCatalogPage(req: Request, res: Response) {
    const params = validateRequestCatalogPage(new Object(req.query)) as WebhookProductCatalogTemplateQueries;
    res.setHeader('Content-Type', 'application/json');
    const result = await ViewRender.productCatalogService.handlePurchaseCatalogPage(params);
    return res.end(JSON.stringify(result));
  }

  async handlePurchaseCatalogCart(req: Request, res: Response) {
    const { auth } = validateRequestCatalogAuth(new Object(req.query)) as WebhookProductCatalogCartTemplateQueries;
    const cartPayload = req.body as ISalePageCartPayload;
    const result = await ViewRender.productCatalogService.handlePurchaseCatalogCart(auth, cartPayload);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result));
  }

  async handleSessionSet(req: Request, res: Response) {
    const { auth } = validateRequestCatalogAuth(new Object(req.query)) as WebhookProductCatalogCartTemplateQueries;
    const catalogStorage = req.body as IProductCatalogSession;
    const result = await ViewRender.productCatalogService.handleSessionSet(auth, catalogStorage);
    return res.end(JSON.stringify(result));
  }

  async handleSessionGet(req: Request, res: Response) {
    const { auth } = validateRequestCatalogAuth(new Object(req.query)) as WebhookProductCatalogCartTemplateQueries;
    const catalogStorage = await ViewRender.productCatalogService.handleSessionGet(auth);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(catalogStorage));
  }
}

const viewRender = new ViewRender();
export const ViewRenderController = {
  handlePurchaseTemplates: expressHandlerRender({
    handler: viewRender.handlePurchaseTemplates,
    validator: (x: any) => x,
  }),
  handleLeadTemplates: expressHandlerRender({
    handler: viewRender.handleLeadTemplates,
    validator: (x: any) => x,
  }),
  handleQuotationTemplates: expressHandlerRender({
    handler: viewRender.handleQuotationTemplates,
    validator: (x: any) => x,
  }),
  handleLineWebviewRoute: expressHandlerRender({
    handler: viewRender.handleLineWebviewRoute,
    validator: (x: any) => x,
  }),
  handlePurchaseRedirect: expressHandlerRender({
    handler: viewRender.handlePurchaseRedirect,
    validator: (x: any) => x,
  }),
  handlePDPADataUse: expressHandlerRender({
    handler: viewRender.handlePDPADataUse,
    validator: (x: any) => x,
  }),
  handlePDPAPrivacy: expressHandlerRender({
    handler: viewRender.handlePDPAPrivacy,
    validator: (x: any) => x,
  }),
  handlePurchaseCatalogPage: expressHandlerRender({
    handler: viewRender.handlePurchaseCatalogPage,
    validator: (x: any) => x,
  }),
  handlePurchaseCatalogCart: expressHandlerRender({
    handler: viewRender.handlePurchaseCatalogCart,
    validator: (x: any) => x,
  }),
  handleSessionSet: expressHandlerRender({
    handler: viewRender.handleSessionSet,
    validator: (x: any) => x,
  }),
  handleSessionGet: expressHandlerRender({
    handler: viewRender.handleSessionGet,
    validator: (x: any) => x,
  }),
};
