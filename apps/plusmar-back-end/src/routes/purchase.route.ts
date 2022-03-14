import { Express } from 'express';
import { WebviewAuthController } from '../controllers/auth';
import { purchaseOrderMessageController } from '../controllers/purchase-order/purchase-order-message.controller';

export const purchasingOrderRoutes = (app: Express): void => {
  app.post('/purchase/postback', WebviewAuthController.webViewAuthValidator, purchaseOrderMessageController.handlePostbackMessages);
  // Check is transaction can process
  // app.post('/purchase/transaction', WebviewAuthController.webViewAuthValidator, purchaseOrderMessageController.handleTransactionChecker);

  app.post('/purchase/paypal', WebviewAuthController.webViewAuthValidator, purchaseOrderMessageController.handlePaypalCheckInitiator);

  app.post('/purchase/2c2p', WebviewAuthController.webViewAuthValidator, purchaseOrderMessageController.handle2C2PInitiator);
  // Postback from 2C2P
  app.post('/2c2p-payment', WebviewAuthController.webViewAuthValidator, purchaseOrderMessageController.handlePostbackMessages);

  // Redirect from 2C2P Payment page back to Webview
  app.post('/2c2p-payment-redirect', WebviewAuthController.webViewAuthValidator, purchaseOrderMessageController.handle2C2PRedirect);

  // Postback from Omise
  app.post('/omise-payment', purchaseOrderMessageController.handlePostbackOmiseMessages);

  app.post('/purchase/omise', WebviewAuthController.webViewAuthValidator, purchaseOrderMessageController.handleOmiseInitiator);
  // Redirect from Omise Internet Banking Payment page back to Webview
  app.get('/omise-payment-redirect', WebviewAuthController.webViewAuthValidator, purchaseOrderMessageController.handleOmiseRedirectHandler);
};
