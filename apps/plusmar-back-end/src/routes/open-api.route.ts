import { openAPIUserController, openAPIMessageController, openAPITagsController, openAPIPurchasingController } from '../controllers/openapi';
import { Express, Request, Response } from 'express';

export const openAPI = (app: Express): void => {
  app.get('/api/v1', (req: Request, res: Response) => {
    res.send({ value: 'Welcome to more-commerce! Open API V1' });
  });

  app.get('/api/v1/users/line', openAPIUserController.getLineUsersList);
  app.post('/api/v1/messaging/line', openAPIMessageController.sendLineMessageOpenAPI);

  app.get('/api/v1/tags/getall', openAPITagsController.getAllTags);
  app.post('/api/v1/tags/settag', openAPITagsController.setTagsByCustomerID);

  app.get('/api/v1/customer/customerinfo', openAPIUserController.getCustomerInfoByCustomerID);
  app.post('/api/v1/customer/updateinfo', openAPIUserController.updateCustomerByCustomerID);

  app.post('/api/v1/purchasing/quickpay/create', openAPIPurchasingController.createPurchasingQuickPay);
  app.post('/api/v1/purchasing/quickpay/cancel', openAPIPurchasingController.cancelBilligQuickPay);
};
