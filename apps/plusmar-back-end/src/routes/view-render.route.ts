import { Express } from 'express';
import { WebviewAuthController } from '../controllers/auth';
import { ViewRenderController } from '../controllers/view-render';

export const viewRenderRoutes = (app: Express): void => {
  app.get('/purchase', WebviewAuthController.webViewAuthValidator, ViewRenderController.handlePurchaseTemplates);
  app.get('/purchase-redirect', WebviewAuthController.webViewAuthValidator, ViewRenderController.handlePurchaseRedirect);
  app.get('/purchase-omise-redirect', WebviewAuthController.webViewAuthValidator, ViewRenderController.handlePurchaseRedirect);
  app.get('/purchase/catalog', WebviewAuthController.webViewAuthValidator, ViewRenderController.handlePurchaseCatalogPage);
  app.post('/purchase/catalog/cart', WebviewAuthController.webViewAuthValidator, ViewRenderController.handlePurchaseCatalogCart);

  app.get('/lead', WebviewAuthController.webViewAuthValidator, ViewRenderController.handleLeadTemplates);

  // app.get('/quotation', ViewRenderController.handleQuotationTemplates);

  // TODO : Need to check
  app.get('/webview', ViewRenderController.handleLineWebviewRoute);
  app.get('/datause', ViewRenderController.handlePDPADataUse);
  app.get('/terms', ViewRenderController.handlePDPAPrivacy);

  app.post('/session/set', WebviewAuthController.webViewAuthValidator, ViewRenderController.handleSessionSet);
  app.get('/session/get', WebviewAuthController.webViewAuthValidator, ViewRenderController.handleSessionGet);
};
