import * as helmet from 'helmet';
import { Express } from 'express';
export const middleware = (app: Express): void => {
  if (process.env.NODE_ENV === 'production') app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }));
};
