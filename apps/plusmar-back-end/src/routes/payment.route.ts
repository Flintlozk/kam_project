import { EnumAuthError, IPayment2C2PResponse } from '@reactor-room/itopplus-model-lib';
import { Express } from 'express';
import { env } from 'process';
import { orderHistoryController } from '../controllers/order-history';
import { purchaseOrderMessageController } from '../controllers/purchase-order';
import { subscriptionActiveHistoryMessageController } from '../controllers/subscription-active-history';
import { environment } from '../environments/environment';

export const paymentRoute = (app: Express): void => {
  app.post('/subscription-payment', async (req, res) => {
    await orderHistoryController.handlePostbackMessages(req, res);
  });

  app.post('/subscription-active-history', async (req, res) => {
    const result = await subscriptionActiveHistoryMessageController.handleCreateSubscriptionActiveHistoryMessage(req, res);
    await res.send(result);
  });

  app.post('/request-token', async (req, res) => {
    const result = await subscriptionActiveHistoryMessageController.handleCreateSubscriptionActiveHistoryRequestToken(req, res);
    await res.send(result);
  });

  app.post('/redirect', (req, res) => {
    const paymentResponse = req.body as IPayment2C2PResponse;
    let baseUrl;
    if (env.NODE_ENV === 'production') {
      baseUrl = env.origin;
    } else {
      baseUrl = environment.origin;
    }
    if (paymentResponse.payment_status === '000') {
      res.redirect(`${baseUrl}/dashboard`);
    } else {
      res.redirect(`${baseUrl}/dashboard?err=${EnumAuthError.PAYMENT_FAILED}`);
    }
  });
};
