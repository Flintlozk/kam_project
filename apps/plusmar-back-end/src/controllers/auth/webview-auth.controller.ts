import { AuthService } from '@reactor-room/itopplus-services-lib';
import { expressHandlerMiddleware, expressHandlerStatus } from '../express-handler';
import { NextFunction, Request, Response } from 'express';

class WebviewAuth {
  public static instance: WebviewAuth;
  public static authService: AuthService;

  public static getInstance(): WebviewAuth {
    if (!WebviewAuth.instance) WebviewAuth.instance = new WebviewAuth();
    return WebviewAuth.instance;
  }
  constructor() {
    WebviewAuth.authService = new AuthService();
  }

  async webViewAuthValidatorHandler(req: Request, next: NextFunction): Promise<void> {
    await WebviewAuth.authService.webViewAuthValidator(req);
    next();
  }
  async webViewPostbackAuthValidatorHandler(req: Request, res: Response): Promise<void> {
    await WebviewAuth.authService.webViewPostbackValidator(req, res);
  }
}

const webviewAuth: WebviewAuth = WebviewAuth.getInstance();
export const WebviewAuthController = {
  webViewAuthValidator: expressHandlerMiddleware({
    handler: webviewAuth.webViewAuthValidatorHandler,
  }),
  webViewPostbackAuthValidator: expressHandlerStatus({
    handler: webviewAuth.webViewPostbackAuthValidatorHandler,
  }),
};
