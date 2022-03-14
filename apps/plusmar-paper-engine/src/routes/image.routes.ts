import { Express } from 'express';
import * as express from 'express';
import * as path from 'path';

export const imageRoute = (app: Express): void => {
  app.use('/javascript', express.static(path.join(__dirname, './assets/static')));
  app.use('/style', express.static(path.join(__dirname, './assets/css')));
  app.use('/images', express.static(path.join(__dirname, './assets/images')));
};
