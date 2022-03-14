import { Express } from 'express';
import { monitoringController } from '../controller/monitoring';
import { publishController } from '../controller/publish/publish.controller';

export const routeRegister = (app: Express): void => {
  app.post('/generator/:pageID/:subscriptionID/:pageUUID', publishController.publishAllPages);
  app.get('/mongostatus', async (req, res) => {
    const result = await monitoringController.monitoringMongo();
    res.status(result.status).send(result.value);
  });
};
