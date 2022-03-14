import type { IFacebookCredential } from '@reactor-room/model-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { EnumLoginType, EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { FacebookLoginService } from '@reactor-room/itopplus-services-lib';
import { checkAuthScope, requireLogin } from '@reactor-room/itopplus-services-lib';
import { validateResponseHTTPObject } from '../../schema/common';
import { validateRequestloginAuth, validateResponseloginAuth } from '../../schema/login';
import { graphQLHandler } from '../graphql-handler';

class LoginFacebok {
  public static instance: LoginFacebok;
  public static loginService: FacebookLoginService;

  public static getInstance(): LoginFacebok {
    if (!LoginFacebok.instance) LoginFacebok.instance = new LoginFacebok();
    return LoginFacebok.instance;
  }
  constructor() {
    LoginFacebok.loginService = new FacebookLoginService();
  }

  @checkAuthScope(EnumLoginType.FACEBOOK)
  async facebookLoginAuthHandler(parent, args, context: IGQLContext) {
    const credential = validateRequestloginAuth<IFacebookCredential>(args.credential);
    const result = await LoginFacebok.loginService.facebookLoginAuth(credential, context.page_index, context.subscription_index, context.app_module);
    return result;
  }
  // EnumAppScopeType
  @requireLogin([EnumAuthScope.SOCIAL, EnumAuthScope.CMS, EnumAuthScope.AUTODIGI])
  // @checkAppScope(EnumAppScopeType.MORE_COMMERCE)
  verifyAuthHandler(parent, args, context: IGQLContext) {
    return LoginFacebok.loginService.verifyAuth(context.access_token);
  }
}

const login: LoginFacebok = LoginFacebok.getInstance();
export const loginFacebookResolver = {
  Mutation: {
    facebookLoginAuth: graphQLHandler({
      handler: login.facebookLoginAuthHandler,
      validator: validateResponseloginAuth,
    }),
  },
  Query: {
    verifyAuth: graphQLHandler({
      handler: login.verifyAuthHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
