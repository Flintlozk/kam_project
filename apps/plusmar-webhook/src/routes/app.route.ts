import { Express } from 'express';
import { monitoringController } from '../controllers/monitoring';

export const monitorRouteRegister = (app: Express): void => {
  app.get('/', (req, res) => {
    res.send({ value: 'Webhook Open API 1.31' });
  });
  app.get('/api', (req, res) => {
    res.send({ value: 'Webhook Open API 1.31' });
  });

  app.get('/checkstatus', async (req, res) => {
    const resultMongo = await monitoringController.monitoringMongo();
    if (resultMongo.status === 200) {
      const resultPG = await monitoringController.monitoringPG();
      if (resultPG.status === 200) {
        res.status(200).send('OK');
      } else {
        res.status(500).send('ERROR');
      }
    } else {
      res.status(500).send('ERROR');
    }
  });
};
