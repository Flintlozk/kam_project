import { Express } from 'express';
import { WebviewAuthController } from '../controllers/auth';
import { leadsMessageController } from '../controllers/leads/leads-message.controller';

export const leadFormRoutes = (app: Express): void => {
  app.post('/lead/postback', WebviewAuthController.webViewAuthValidator, leadsMessageController.handlePostbackMessages);
};
