import { Express } from 'express';
import { monitoringController } from '../controllers/monitoring';

export const routeRegister = (app: Express): void => {
  app.get('/', (req, res) => {
    res.send({ value: 'Welcome to back-end! Open API 1.31' });
  });
  app.get('/api', (req, res) => {
    res.send({ value: 'Welcome to back-end! Open API 1.31' });
  });

  app.get('/mongostatus', async (req, res) => {
    const ip = req.headers['x-forwarded-for'];
    if (ip.indexOf('34.87.153.10') !== -1) {
      const result = await monitoringController.monitoringMongo();
      res.status(result.status).send(result.value);
    } else {
      res.status(401).send('unauthorized');
    }
  });
  app.get('/pgstatus', async (req, res) => {
    const ip = req.headers['x-forwarded-for'];
    if (ip.indexOf('34.87.153.10') !== -1) {
      const result = await monitoringController.monitoringPG();
      res.status(result.status).send(result.value);
    } else {
      res.status(401).send('unauthorized');
    }
  });

  app.post('/shopee/auth', (req, res) => {
    console.log('ShopeeReq :>> ', req);
    console.log('ShopeeRes :>> ', res);
  });
};
