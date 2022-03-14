import { IGoogleCredential, IHTTPResult } from '@reactor-room/model-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { GoogleLoginService } from '@reactor-room/itopplus-services-lib';
import { requireLogin } from '@reactor-room/itopplus-services-lib';
import { validateResponseHTTPObject } from '../../schema/common';
import { validateRequestGoogleLoginAuth, validateResponseloginAuth } from '../../schema/login';
import { graphQLHandler } from '../graphql-handler';

class LoginGoogle {
  public static instance: LoginGoogle;
  public static loginService: GoogleLoginService;
  public static getInstance(): LoginGoogle {
    if (!LoginGoogle.instance) LoginGoogle.instance = new LoginGoogle();
    return LoginGoogle.instance;
  }
  constructor() {
    LoginGoogle.loginService = new GoogleLoginService();
  }

  async loginAuthHandler(parent, args: { credential: IGoogleCredential }, context: IGQLContext): Promise<IHTTPResult> {
    const credential = validateRequestGoogleLoginAuth<IGoogleCredential>(args.credential);
    return await LoginGoogle.loginService.loginAuth(credential);
  }

  @requireLogin([EnumAuthScope.ADMIN])
  async verifyAdminTokenHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    return await LoginGoogle.loginService.verifyAuth(context.access_token);
  }
}

const adminLogin: LoginGoogle = LoginGoogle.getInstance();
export const LoginGoogleResolver = {
  Mutation: {
    loginAuth: graphQLHandler({
      handler: adminLogin.loginAuthHandler,
      validator: validateResponseloginAuth,
    }),
  },
  Query: {
    verifyAdminToken: graphQLHandler({
      handler: adminLogin.verifyAdminTokenHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
