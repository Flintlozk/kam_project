import * as cors from 'cors';
import * as express from 'express';
import * as morgan from 'morgan';
import * as path from 'path';
import { environment } from '../environments/environment';
// import multer from 'multer';

export const setupAppServerConnection = (app: express.Express): void => {
  if (!environment.production) {
    app.use(morgan('tiny'));
  }

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const corsOptionsDelegate = (req, callback) => {
    let corsOptions: { origin: boolean; credentials: boolean };
    const whitelist = [environment.origin, environment.adminOrigin];
    if (!environment.production) {
      corsOptions = { origin: true, credentials: true };
    } else {
      if (whitelist.indexOf(req.header('Origin')) !== -1) corsOptions = { origin: true, credentials: true };
      else corsOptions = { origin: false, credentials: true };
    }
    callback(null, corsOptions);
  };
  app.use(cors(corsOptionsDelegate));

  app.set('views', path.join(__dirname, './assets/views'));
  app.set('view engine', 'ejs');
};
