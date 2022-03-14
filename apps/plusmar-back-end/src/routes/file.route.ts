import { ExpressJSDynamicHandlerType } from '@reactor-room/model-lib';
import { Express } from 'express';
import { fileController } from '../controllers/file/file.controller';

export const fileRouteRegister = (app: Express): void => {
  app.get(
    '/file/:audienceID/:messageID/:filename',
    (req, res, next) => {
      const ua = req.headers['user-agent'];
      res.locals = { handlerType: ExpressJSDynamicHandlerType.REDIRECT, os: '' };
      let os = '';
      if (/android/i.test(ua)) {
        os = 'Android';
        res.locals.os = os;
      } else if (/iPad|iPhone|iPod/.test(ua)) {
        os = 'iOS';
        res.locals.handlerType = ExpressJSDynamicHandlerType.RENDER;
        res.locals.os = os;
      } else {
        res.locals.os = 'Others';
      }

      next();
    },
    fileController.getFile,
  );
};
