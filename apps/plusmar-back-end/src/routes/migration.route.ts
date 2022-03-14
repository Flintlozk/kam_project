import { Express, Request, Response } from 'express';

import { MigrationController } from '../controllers/migration';
export const migrateRouteRegister = (app: Express, parentRoute = '/migration'): void => {
  // app.get(
  //   `${parentRoute}/appscope`,
  //   async (req: Request, res: Response): Promise<void> => {
  //     await MigrationController.migrateUserSocialScope(req, res);
  //   },
  // );
};

export const migrateRouteLogistic = (app: Express, parentRoute = '/logistic-migration'): void => {
  app.get(`${parentRoute}`, async (req: Request, res: Response): Promise<void> => {
    if (req.query.token === 'itopplus') {
      await MigrationController.migrateLogisticScope(req, res);
    } else {
      res.sendStatus(401);
    }
  });
};
