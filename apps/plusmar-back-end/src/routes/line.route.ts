import { getImageNotFound } from '@reactor-room/itopplus-back-end-helpers';
import { Express, Request, Response } from 'express';
import { lineClientContentMessageController } from '../controllers/line/message';

export const lineRoutes = (app: Express): void => {
  //TODO: for old path (use pageId but it less secure we can remove after pass 1 year.)
  app.get('/linecontent/:pageID/:audienceID/:messageID', async (req: Request, res: Response) => {
    try {
      const result = await lineClientContentMessageController.getLineContentByPageAndMessageID(req);
      if (result.status !== 200) {
        res.end(getImageNotFound());
      } else {
        res.writeHead(200, {
          'Content-Type': result.headers['content-type'],
          'Content-Length': result.headers['content-length'],
        });
        res.end(result.data);
      }
    } catch (err) {
      res.sendStatus(400);
    }
  });
  app.get('/linecontentuuid/:UUID/:audienceID/:messageID', async (req: Request, res: Response) => {
    try {
      const result = await lineClientContentMessageController.getLineContentByPageAndMessageIDByUUID(req);
      switch (result.status) {
        case 200:
          res.writeHead(200, {
            'Content-Type': result.headers['content-type'],
            'Content-Length': result.headers['content-length'],
          });
          res.end(result.data);
          break;
        case 404:
          res.writeHead(200, {
            'Content-Type': 'image/png',
          });
          res.end(getImageNotFound());
          break;
        default:
          res.end(result.data);
      }
    } catch (err) {
      console.log('err [LOG]:--> ', err);
      res.sendStatus(400);
    }
  });
};
