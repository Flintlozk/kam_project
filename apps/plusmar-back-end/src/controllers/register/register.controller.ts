import { IHTTPResult, IRegisterArgs } from '@reactor-room/model-lib';
import { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { RegisterService } from '@reactor-room/itopplus-services-lib';
import { validateRequestOtpObject, valdiatePhoneNumberObject } from '../../schema/register';
import { graphQLHandler } from '../graphql-handler';
import { validateAccessTokenObjectValidate, validateResponseHTTPObject } from '../../schema/common';

class Register {
  constructor() {
    Register.registerService = new RegisterService();
  }
  public static instance;
  public static registerService: RegisterService;

  public static getInstance() {
    if (!Register.instance) Register.instance = new Register();
    return Register.instance;
  }

  async sendOTPHandler(parent, args: IRegisterArgs, context: IGQLContext): Promise<IHTTPResult> {
    const { access_token } = validateAccessTokenObjectValidate<IGQLContext>(context);
    const { phoneNumber } = valdiatePhoneNumberObject<IRegisterArgs>(args);
    return await Register.registerService.sendOTP(access_token, phoneNumber);
  }

  async validateOTPHandler(parent, args: IRegisterArgs, context: IGQLContext): Promise<IHTTPResult> {
    const { access_token } = validateAccessTokenObjectValidate<IGQLContext>(context);
    const { pin, phoneNumber } = validateRequestOtpObject<IRegisterArgs>(args);
    return await Register.registerService.validateOTP(access_token, pin, phoneNumber);
  }
}

const register: Register = Register.getInstance();
export const registerResolver = {
  Mutation: {
    sendOTP: graphQLHandler({
      handler: register.sendOTPHandler,
      validator: validateResponseHTTPObject,
    }),
    validateOTP: graphQLHandler({
      handler: register.validateOTPHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
