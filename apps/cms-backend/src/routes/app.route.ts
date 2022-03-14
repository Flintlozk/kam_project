import { Express } from 'express';
import { staticHtmlController } from '../controllers/statichtml/statichtml.controller';

export const routeRegister = (app: Express): void => {
  app.get('/themes/:id/:index/:userID/:webPageID', staticHtmlController.getThemeStaticHtml);
};
