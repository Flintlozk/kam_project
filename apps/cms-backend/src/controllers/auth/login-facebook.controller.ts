import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { EnumLoginType, EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { FacebookLoginService } from '@reactor-room/itopplus-services-lib';
import { checkAuthScope, requireLogin } from '@reactor-room/itopplus-services-lib';
import { validateDefaultResponse } from '../../schema/default/default.schema';
import { graphQLHandler } from '../graphql-handler';
import { IFacebookCredential } from '@reactor-room/model-lib';

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
  async facebookLoginAuthHandler(parent, args: { credential: IFacebookCredential }, context: IGQLContext) {
    const credential = args.credential;
    const result = await LoginFacebok.loginService.facebookLoginAuth(credential, context.page_index, context.subscription_index, context.app_module);
    return result;
  }

  @requireLogin([EnumAuthScope.CMS])
  verifyAuthHandler(parent, args, context: IGQLContext) {
    return LoginFacebok.loginService.verifyAuth(context.access_token);
  }
  @requireLogin([EnumAuthScope.ADMIN_CMS])
  verifyAdminCMSAuthHandler(parent, args, context: IGQLContext) {
    return LoginFacebok.loginService.verifyAuth(context.access_token);
  }
}

const login: LoginFacebok = LoginFacebok.getInstance();
export const loginFacebookResolver = {
  Mutation: {
    facebookLoginAuth: graphQLHandler({
      handler: login.facebookLoginAuthHandler,
      validator: validateDefaultResponse,
    }),
  },
  Query: {
    verifyAuth: graphQLHandler({
      handler: login.verifyAuthHandler,
      validator: validateDefaultResponse,
    }),
    verifyAdminCMSAuth: graphQLHandler({
      handler: login.verifyAdminCMSAuthHandler,
      validator: validateDefaultResponse,
    }),
  },
};
