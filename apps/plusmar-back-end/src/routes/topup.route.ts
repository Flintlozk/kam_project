import { Express } from 'express';
import { topUpHistoriesContoller } from '../controllers/topup/topup.controller';

export const topUpRoute = (app: Express): void => {
  // 2C2P Postback
  // TODO : Hash UserID PageID ..(e.g.)
  app.post('/topup-payment', topUpHistoriesContoller.topUpTransactionPostback);
  // 2C2P View Redirect to NG
  app.post('/topup-redirect', topUpHistoriesContoller.topUpRedirect);
};
