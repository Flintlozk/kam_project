import * as helmet from 'helmet';
import { Express } from 'express';
export const middleware = (app: Express): void => {
  app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }));
};
