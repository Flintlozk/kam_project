import { IHTTPResult } from '@reactor-room/model-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { LoginTestAccountService } from '@reactor-room/itopplus-services-lib';
import { validateResponseHTTPObject } from '../../schema/common';
import { graphQLHandler } from '../graphql-handler';

class LoginTest {
  public static instance: LoginTest;
  public static getInstance(): LoginTest {
    if (!LoginTest.instance) LoginTest.instance = new LoginTest();
    return LoginTest.instance;
  }

  public static loginTestAccountService: LoginTestAccountService;

  constructor() {
    LoginTest.loginTestAccountService = new LoginTestAccountService();
  }

  async loginTestAuthHandler(parent, args: { index: number }, context: IGQLContext): Promise<IHTTPResult> {
    const result = await LoginTest.loginTestAccountService.loginTestAuth(args.index, context.page_index, context.subscription_index, context.app_module);
    return result;
  }
}

const loginTest: LoginTest = LoginTest.getInstance();
export const LoginTestResolver = {
  Mutation: {
    loginTestAuth: graphQLHandler({
      handler: loginTest.loginTestAuthHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
