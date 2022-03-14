import { Express } from 'express';
import { loginController } from '../controllers/login/login.controller';

export const googleAuthRoute = (app: Express): void => {
  app.post('/login/googleAuth', loginController.googleAuth);
};
