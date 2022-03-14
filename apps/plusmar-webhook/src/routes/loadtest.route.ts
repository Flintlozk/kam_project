import { PageExitsType } from '@reactor-room/itopplus-model-lib';
import { Express, Request, Response } from 'express';
import { facebookListenController } from '../controllers/facebook/listener.controller';
import { lineListenController } from '../controllers/line/listener.controller';
import { SharedCtrl } from '../controllers/shared/shared.controller';
import { checkWRK } from './middleware.route';

const ack = () => {
  console.log('________________________________________________________________________________ ACK ');
};
const nack = () => {
  console.log('________________________________________________________________________________ NACK ');
};

export const loadTestLineMessageListeningService = async (messageData): Promise<boolean> => {
  // messageData.events[0].timestamp = Number(new Date());
  const pageExist = await SharedCtrl.checkPageExitsHandler(messageData, PageExitsType.LINE);
  if (pageExist) {
    const runnerStatus = await lineListenController.lineListenHandler(messageData);
    if (runnerStatus === true) {
      ack();
    } else if (runnerStatus === false) {
      ack();
    } else {
      nack();
    }
  } else {
    ack();
  }
  return true;
};
export const loadTestFacebookListeningService = async (messageData): Promise<boolean> => {
  const pageExist = await SharedCtrl.checkPageExitsHandler(messageData, PageExitsType.FACEBOOK);
  if (pageExist) {
    const runnerStatus = await facebookListenController.facebookListenHandler(messageData);
    if (runnerStatus === true) {
      ack();
    } else if (runnerStatus === false) {
      ack();
    } else {
      nack();
    }
  } else {
    ack();
  }
  return true;
};

export const loadTestRoute = (app: Express): void => {
  app.post('/loadtest', checkWRK, async (req: Request, res: Response) => {
    console.log('Incoming');
    const result = await loadTestLineMessageListeningService(req.body);
    console.log('Response', result);
    res.sendStatus(200);
  });
  app.post('/facebook-webhook-loadtest', checkWRK, async (req: Request, res: Response) => {
    console.log('Incoming');
    console.log('req.body [LOG]:--> ', req.body);
    const result = await loadTestFacebookListeningService(req.body);
    console.log('Response', result);
    res.sendStatus(200);
  });
};
