import { expressHandler } from '../express-handler';
import { LoginService } from '@reactor-room/crm-services-lib';
import { IGQLContext, ILoginResponse } from '@reactor-room/crm-models-lib';
import { graphQLHandler } from '../graphql-handler';
import { validateResponseHTTPObject } from '../../schema/common';
import { validateResponseGetUserDataGoogle } from '../../schema/task/task.schema';
import { environment } from '../../environments/environment';
import { Request, Response } from 'express';
class Login {
  public static instance;
  public static login: Login;
  public static getInstance() {
    if (!Login.instance) Login.instance = new Login();
    return Login.instance;
  }

  constructor() {}

  async googleAuthHandler(request: Request, respond: Response): Promise<ILoginResponse> {
    return await LoginService.googleAuth(request.body.accessToken, environment.pageKey, environment.tokenKey);
  }

  async verifyAuthHandler(parent, args, context: IGQLContext): Promise<ILoginResponse> {
    return await LoginService.verifyAuth(context.access_token, environment.tokenKey);
  }
}

const login: Login = Login.getInstance();

export const loginController = {
  googleAuth: expressHandler({
    handler: login.googleAuthHandler,
    validator: validateResponseGetUserDataGoogle,
  }),
};

export const loginResolver = {
  Query: {
    verifyAuth: graphQLHandler({
      handler: login.verifyAuthHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
