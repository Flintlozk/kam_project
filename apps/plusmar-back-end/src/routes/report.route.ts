import { Express } from 'express';
import { reportResolver, reportLabelPDF, reportFlash } from '../../src/controllers/report/reports.controller';
import { isNotEmptyValue } from '@reactor-room/itopplus-back-end-helpers';
export const reportRouteRegister = (app: Express, parentRoute = '/report'): void => {
  // TODO: check foward-ip only allow by subnet (GCP)

  app.post(`${parentRoute}/orderDetail`, async (req, res) => {
    const uuid = req.query.uuid.toString();
    const result = await reportResolver(uuid);
    res.send(result);
  });
  // TODO : More security require here
  app.get(`${parentRoute}/label/:uuid/:type`, async (req, res) => {
    const filePDF = await reportLabelPDF(req.params.uuid);
    res.set('Content-Type', 'application/pdf');
    if (isNotEmptyValue(filePDF)) {
      if (req.params.type == 'vertical') {
        res.send(Buffer.from(filePDF.label1, 'base64'));
      } else {
        res.send(Buffer.from(filePDF.label2, 'base64'));
      }
    } else {
      res.sendStatus(404);
    }
  });
  app.post(`${parentRoute}/flash-report`, async (req, res) => {
    const uuid = req.query.uuid.toString();
    const result = await reportFlash(uuid);
    res.send(result);
  });
};
