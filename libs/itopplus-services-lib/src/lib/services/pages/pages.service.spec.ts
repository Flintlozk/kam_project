import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  EnumAuthError,
  EnumPagesError,
  EnumPaymentType,
  EnumWizardStepError,
  EnumWizardStepType,
  IFacebookPageResponse,
  IGetShopDetail,
  IPages,
  IPayload,
  IPlanLimitAndDetails,
  IPlanName,
  IUserCredential,
  IUserSubscriptionMappingModel,
  ReturnAddBankAccount,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import * as data from '../../data';
import { PagesError, SubscriptionError } from '../../errors';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { PagesService } from './pages.service';
import { environmentLib } from '@reactor-room/environment-services-backend';
const pages = new PagesService();
PlusmarService.environment = { ...environmentLib, more_api_key: '1234' };
jest.mock('../../data');
jest.mock('../plusmarservice.class');
jest.mock('@reactor-room/itopplus-back-end-helpers');
describe('Page Service Test', () => {
  test('get picture fan page', async () => {
    mock(data, 'getPagePicutreFromFacebookByFanpageID', jest.fn().mockResolvedValue({ url: 'https://www.facebook.com/itopplus/photos/a.151598428260331/3353953864691422/' }));
    const result = await pages.getPictureFromFacebookFbPageID('', '');
    expect(result).toEqual('https://www.facebook.com/itopplus/photos/a.151598428260331/3353953864691422/');
  });

  test('createClientAPI Case First Create', async () => {
    mock(data, 'getPageByID', jest.fn().mockResolvedValue({ api_client_id: null, api_client_secret: null, benabled_api: false } as IPages));
    mock(data, 'createClientAPI', jest.fn().mockResolvedValue({ api_client_id: 'aaaa', api_client_secret: 'bbbbb', benabled_api: true } as IPages));
    mock(helpers, 'cryptoEncode', jest.fn().mockResolvedValue('xxxxxxxx'));
    const result = await pages.createClientAPI(360, true);
    expect(result.benabled_api).toEqual(true);
    expect(result.api_client_id).not.toBe(null);
    expect(result.api_client_secret).not.toBe(null);
    expect(data.getPageByID).toBeCalled();
    expect(data.createClientAPI).toBeCalled();
    expect(helpers.cryptoEncode).toBeCalled();
  });

  test('createClientAPI Case Close API', async () => {
    mock(data, 'getPageByID', jest.fn().mockResolvedValue({ api_client_id: 'aaaa', api_client_secret: 'bbbbb', benabled_api: true } as IPages));
    mock(data, 'setClientAPIStatus', jest.fn().mockResolvedValue({ api_client_id: 'aaaa', api_client_secret: 'bbbbb', benabled_api: false } as IPages));
    const result = await pages.createClientAPI(360, false);
    expect(result.benabled_api).toEqual(false);
    expect(result.api_client_id).not.toBe(null);
    expect(result.api_client_secret).not.toBe(null);
    expect(data.getPageByID).toBeCalled();
    expect(data.setClientAPIStatus).toBeCalled();
  });
});

describe('createDefaultPage', () => {
  test('Should successfully create default page', async () => {
    PlusmarService.writerClient = {} as unknown as Pool;
    const pagesService = new PagesService();
    const userSub = {
      subscription_id: '12345',
    } as IUserSubscriptionMappingModel;
    const subscriptionDetail = {} as IPlanLimitAndDetails;
    const user = {
      email: 'sss@mail.com',
      tel: '0999999999',
    } as IUserCredential;
    const page = { id: 1 } as IPages;

    mock(data, 'getUserSubscriptionMappingByUserID', jest.fn().mockResolvedValueOnce(userSub));
    mock(data, 'getUserByID', jest.fn().mockResolvedValueOnce(user));
    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValueOnce(new Pool()));
    mock(data, 'createDefaultPage', jest.fn().mockResolvedValueOnce(page));
    mock(pagesService.initPageService, 'setPageCommonDefault', jest.fn());
    mock(data, 'addPageSubscriptionsMappings', jest.fn());
    mock(data, 'createUserPageMapping', jest.fn());
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue(new Pool()));
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ value: 'sdf' } as IHTTPResult));
    mock(helpers, 'getKeysFromSession', jest.fn().mockResolvedValueOnce({} as IPayload));
    mock(helpers, 'setSessionValue', jest.fn());
    mock(helpers, 'getKeysFromSession', jest.fn());

    const result = await pagesService.createDefaultPage(1, 'asdads', subscriptionDetail);
    expect(result.status).toEqual(200);
    expect(data.getUserSubscriptionMappingByUserID).toHaveBeenCalledTimes(1);
    expect(data.getUserByID).toHaveBeenCalledTimes(1);
    expect(PostgresHelper.execBeginBatchTransaction).toHaveBeenCalledTimes(1);
    expect(data.createDefaultPage).toHaveBeenCalledTimes(1);
    expect(pagesService.initPageService.setPageCommonDefault).toHaveBeenCalledTimes(1);
    expect(data.addPageSubscriptionsMappings).toHaveBeenCalledTimes(1);
    expect(data.createUserPageMapping).toHaveBeenCalledTimes(1);
    expect(PostgresHelper.execBatchCommitTransaction).toHaveBeenCalledTimes(1);
    expect(data.verifyToken).toHaveBeenCalledTimes(1);
    expect(helpers.getKeysFromSession).toHaveBeenCalledTimes(2);
    expect(helpers.setSessionValue).toHaveBeenCalledTimes(1);
  });

  test('Should failed create default page from user have no subscription', async () => {
    PlusmarService.writerClient = {} as unknown as Pool;
    const pagesService = new PagesService();
    const subscriptionDetail = {} as IPlanLimitAndDetails;

    mock(data, 'getUserSubscriptionMappingByUserID', jest.fn().mockResolvedValueOnce(null));
    mock(data, 'getUserByID', jest.fn());
    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn());
    mock(data, 'createDefaultPage', jest.fn());
    mock(pagesService.initPageService, 'setPageCommonDefault', jest.fn());
    mock(data, 'addPageSubscriptionsMappings', jest.fn());
    mock(data, 'createUserPageMapping', jest.fn());
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn());
    mock(data, 'verifyToken', jest.fn());
    mock(helpers, 'getKeysFromSession', jest.fn());
    mock(helpers, 'setSessionValue', jest.fn());
    mock(helpers, 'getKeysFromSession', jest.fn());

    try {
      await pagesService.createDefaultPage(1, 'asdads', subscriptionDetail);
    } catch (err) {
      expect(err).toStrictEqual(new SubscriptionError(EnumAuthError.NO_SUBSCRIPTIONS));
      expect(data.getUserSubscriptionMappingByUserID).toHaveBeenCalledTimes(1);
      expect(data.getUserByID).not.toBeCalled();
      expect(PostgresHelper.execBeginBatchTransaction).not.toBeCalled();
      expect(data.createDefaultPage).not.toBeCalled();
      expect(pagesService.initPageService.setPageCommonDefault).not.toBeCalled();
      expect(data.addPageSubscriptionsMappings).not.toBeCalled();
      expect(data.createUserPageMapping).not.toBeCalled();
      expect(PostgresHelper.execBatchCommitTransaction).not.toBeCalled();
      expect(data.verifyToken).not.toBeCalled();
      expect(helpers.getKeysFromSession).not.toBeCalled();
      expect(helpers.setSessionValue).not.toBeCalled();
    }
  });
});

describe('updateFacebookPageFromWizardStep', () => {
  test('Should successfully update facebook page to page', async () => {
    const pagesService = new PagesService();
    PlusmarService.writerClient = {} as unknown as Pool;
    PlusmarService.environment = { ...environmentLib, pageKey: 'WAKAKA' };
    const fbPage = {
      id: '123245',
      name: 'test',
      picture: 'aa',
      access_token: 'sdfsdf',
    } as IFacebookPageResponse;
    const page = { id: 1 } as IPages;

    mock(helpers, 'cryptoEncode', jest.fn().mockResolvedValueOnce({} as IPayload));
    mock(data, 'getShopFanPageByFbPageID', jest.fn().mockResolvedValueOnce(null));
    mock(data, 'connectFacebookPageToPage', jest.fn());
    mock(pagesService.pageSettingService, 'addPageUsername', jest.fn());
    mock(data, 'getPageByID', jest.fn().mockResolvedValueOnce(page));
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ value: 'sdf' } as IHTTPResult));
    mock(helpers, 'getKeysFromSession', jest.fn());
    mock(helpers, 'setSessionValue', jest.fn());
    mock(helpers, 'getKeysFromSession', jest.fn());

    const result = await pagesService.updateFacebookPageFromWizardStep('userAccessTokn', 1, fbPage);
    expect(result.status).toEqual(200);
    expect(helpers.cryptoEncode).toHaveBeenCalledTimes(1);
    expect(data.getShopFanPageByFbPageID).toHaveBeenCalledTimes(1);
    expect(data.connectFacebookPageToPage).toHaveBeenCalledTimes(1);
    expect(pagesService.pageSettingService.addPageUsername).toHaveBeenCalledTimes(1);
    expect(data.getPageByID).toHaveBeenCalledTimes(1);
    expect(data.verifyToken).toHaveBeenCalledTimes(1);
    expect(data.verifyToken).toHaveBeenCalledTimes(1);
    expect(helpers.getKeysFromSession).toHaveBeenCalledTimes(2);
    expect(helpers.setSessionValue).toHaveBeenCalledTimes(1);
  });

  test('Should failed update facebook page to page from fb already bined', async () => {
    const pagesService = new PagesService();
    PlusmarService.writerClient = {} as unknown as Pool;
    PlusmarService.environment = { ...environmentLib, pageKey: 'WAKAKA' };
    const fbPage = {
      id: '123245',
      name: 'test',
      picture: 'aa',
      access_token: 'sdfsdf',
    } as IFacebookPageResponse;

    mock(helpers, 'cryptoEncode', jest.fn().mockResolvedValueOnce({} as IPayload));
    mock(data, 'getShopFanPageByFbPageID', jest.fn().mockResolvedValueOnce({} as IGetShopDetail));
    mock(data, 'connectFacebookPageToPage', jest.fn());
    mock(pagesService.pageSettingService, 'addPageUsername', jest.fn());
    mock(data, 'getPageByID', jest.fn());
    mock(data, 'verifyToken', jest.fn());
    mock(helpers, 'getKeysFromSession', jest.fn());
    mock(helpers, 'setSessionValue', jest.fn());
    mock(helpers, 'getKeysFromSession', jest.fn());

    try {
      await pagesService.updateFacebookPageFromWizardStep('userAccessTokn', 1, fbPage);
    } catch (err) {
      expect(err).toStrictEqual(new PagesError(EnumPagesError.FB_PAGE_ALREADY_BINDED));
      expect(helpers.cryptoEncode).toHaveBeenCalledTimes(1);
      expect(data.getShopFanPageByFbPageID).toHaveBeenCalledTimes(1);
      expect(data.connectFacebookPageToPage).not.toBeCalled();
      expect(pagesService.pageSettingService.addPageUsername).not.toBeCalled();
      expect(data.getPageByID).not.toBeCalled();
      expect(data.verifyToken).not.toBeCalled();
      expect(data.verifyToken).not.toBeCalled();
      expect(helpers.getKeysFromSession).not.toBeCalled();
      expect(helpers.setSessionValue).not.toBeCalled();
    }
  });
});

describe('updatePageLogisticFromWizardStep', () => {
  test('Should successfully update Page Logistic From Wizard Step', async () => {
    const pagesService = new PagesService();
    PlusmarService.writerClient = {} as unknown as Pool;
    PlusmarService.environment = { ...environmentLib, pageKey: 'WAKAKA' };

    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValueOnce(new Pool()));
    mock(data, 'updatePageDeliveryFee', jest.fn());
    mock(data, 'getPageByID', jest.fn().mockResolvedValueOnce({ wizard_step: EnumWizardStepType.STEP_SET_LOGISTIC } as IPages));
    mock(pagesService, 'updatePageWizardStep', jest.fn());
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue(new Pool()));

    const result = await pagesService.updatePageLogisticFromWizardStep(1);
    expect(result.status).toEqual(200);
    expect(PostgresHelper.execBeginBatchTransaction).toHaveBeenCalledTimes(1);
    expect(data.updatePageDeliveryFee).not.toHaveBeenCalledTimes(1);
    expect(data.getPageByID).toHaveBeenCalledTimes(1);
    expect(pagesService.updatePageWizardStep).toHaveBeenCalledTimes(1);
    expect(PostgresHelper.execBatchCommitTransaction).toHaveBeenCalledTimes(1);
  });

  test('Should successfully update Page Logistic From Wizard Step and current step is not STEP_SET_LOGISTIC', async () => {
    const pagesService = new PagesService();
    PlusmarService.writerClient = {} as unknown as Pool;
    PlusmarService.environment = { ...environmentLib, pageKey: 'WAKAKA' };

    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValueOnce(new Pool()));
    mock(data, 'updatePageDeliveryFee', jest.fn());
    mock(data, 'getPageByID', jest.fn().mockResolvedValueOnce({ wizard_step: EnumWizardStepType.STEP_SET_PAYMENT } as IPages));
    mock(pagesService, 'updatePageWizardStep', jest.fn());
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue(new Pool()));

    const result = await pagesService.updatePageLogisticFromWizardStep(1);
    expect(result.status).toEqual(200);
    expect(PostgresHelper.execBeginBatchTransaction).toHaveBeenCalledTimes(1);
    expect(data.updatePageDeliveryFee).not.toHaveBeenCalledTimes(1);
    expect(data.getPageByID).toHaveBeenCalledTimes(1);
    expect(pagesService.updatePageWizardStep).not.toBeCalled();
    expect(PostgresHelper.execBatchCommitTransaction).toHaveBeenCalledTimes(1);
  });
});

describe('updatePageWizardStepToSuccess', () => {
  test('Should successfully update Wizard step to SETUP_SUCCESS ', async () => {
    const pagesService = new PagesService();
    const page = {
      fb_page_id: '999',
      option: {
        access_token: '1234',
      },
      wizard_step: EnumWizardStepType.STEP_SET_PAYMENT,
    } as IPages;

    mock(data, 'getPageByID', jest.fn().mockResolvedValueOnce(page));
    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValueOnce('asd'));
    mock(data, 'subscribePageToApp', jest.fn());
    mock(pagesService.pageSettingService, 'setPageWhitelist', jest.fn());
    mock(data, 'updatePageWizardStep', jest.fn().mockResolvedValueOnce({ wizard_step: EnumWizardStepType.STEP_SET_PAYMENT } as IPages));
    mock(data, 'getUserByID', jest.fn().mockResolvedValueOnce({ id: 2 } as IUserCredential));
    mock(data, 'getMaximumPageByUserID', jest.fn().mockResolvedValueOnce([{ user_id: 1 } as IPlanName]));

    const result = await pagesService.updatePageWizardStepToSuccess(1, 1, EnumWizardStepType.STEP_SET_PAYMENT);
    expect(result.status).toEqual(200);
    expect(data.getPageByID).toHaveBeenCalledTimes(1);
    expect(helpers.cryptoDecode).toHaveBeenCalledTimes(1);
    expect(data.subscribePageToApp).toHaveBeenCalledTimes(1);
    expect(pagesService.pageSettingService.setPageWhitelist).toHaveBeenCalledTimes(1);
    expect(data.updatePageWizardStep).toHaveBeenCalledTimes(1);
    expect(data.getUserByID).toHaveBeenCalledTimes(1);
    expect(data.getMaximumPageByUserID).toHaveBeenCalledTimes(1);
  });

  test('Should fail to update wizard step to SETUP_SUCCESS from current step is invalid', async () => {
    const pagesService = new PagesService();
    const page = {
      fb_page_id: '999',
      option: {
        access_token: '1234',
      },
      wizard_step: EnumWizardStepType.STEP_SET_PAYMENT,
    } as IPages;

    mock(data, 'getPageByID', jest.fn().mockResolvedValueOnce(page));
    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValueOnce('asd'));
    mock(data, 'subscribePageToApp', jest.fn());
    mock(pagesService.pageSettingService, 'setPageWhitelist', jest.fn());
    mock(data, 'updatePageWizardStep', jest.fn().mockResolvedValueOnce({ wizard_step: EnumWizardStepType.STEP_CONNECT_FACEBOOK } as IPages));
    mock(data, 'getUserByID', jest.fn().mockResolvedValueOnce({ id: 2 } as IUserCredential));
    mock(data, 'getMaximumPageByUserID', jest.fn().mockResolvedValueOnce([{ user_id: 1 } as IPlanName]));

    try {
      await pagesService.updatePageWizardStepToSuccess(1, 1, EnumWizardStepType.STEP_SET_PAYMENT);
    } catch (err) {
      expect(err).toStrictEqual(new Error(EnumWizardStepError.INVALID_WIZARD_STEP));
      expect(data.getPageByID).toHaveBeenCalledTimes(1);
      expect(helpers.cryptoDecode).not.toBeCalled();
      expect(data.subscribePageToApp).not.toBeCalled();
      expect(pagesService.pageSettingService.setPageWhitelist).not.toBeCalled();
      expect(data.updatePageWizardStep).not.toBeCalled();
      expect(data.getUserByID).not.toBeCalled();
      expect(data.getMaximumPageByUserID).not.toBeCalled();
    }
  });
});

describe('delete page', () => {
  test('Should successfully delete page with bank account', async () => {
    const pagesService = new PagesService();
    PlusmarService.writerClient = {} as unknown as Pool;

    mock(data, 'getPageByID', jest.fn().mockResolvedValueOnce({ wizard_step: EnumWizardStepType.STEP_SET_PAYMENT } as IPages));
    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValueOnce(new Pool()));
    mock(data, 'deletePageTax', jest.fn());
    mock(data, 'deletePageLeadForms', jest.fn());
    mock(data, 'deletePageChatTemplates', jest.fn());
    mock(data, 'deletePageLogistics', jest.fn());
    mock(data, 'listAllPayment', jest.fn().mockResolvedValueOnce([{ id: 1, type: EnumPaymentType.BANK_ACCOUNT }]));
    mock(data, 'getBankAccount', jest.fn().mockResolvedValueOnce([{ id: 2 } as ReturnAddBankAccount] as ReturnAddBankAccount[]));
    mock(data, 'deleteBankAccountById', jest.fn());
    mock(data, 'deletePagePayments', jest.fn());
    mock(data, 'deletePageSubscriptionMapping', jest.fn());
    mock(data, 'deletePageMember', jest.fn());
    mock(data, 'deletePageCustomerTags', jest.fn());
    mock(data, 'deletePage', jest.fn());
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValueOnce(new Pool()));

    const result = await pagesService.deletePage(1, 1);
    expect(result.status).toEqual(200);
    expect(data.getPageByID).toHaveBeenCalledTimes(1);
    expect(PostgresHelper.execBeginBatchTransaction).toHaveBeenCalledTimes(1);
    expect(data.deletePageTax).toHaveBeenCalledTimes(1);
    expect(data.deletePageLeadForms).toHaveBeenCalledTimes(1);
    expect(data.deletePageChatTemplates).toHaveBeenCalledTimes(1);
    expect(data.deletePageLogistics).toHaveBeenCalledTimes(1);
    expect(data.listAllPayment).toHaveBeenCalledTimes(1);
    expect(data.getBankAccount).toHaveBeenCalledTimes(1);
    expect(data.deleteBankAccountById).toHaveBeenCalledTimes(1);
    expect(data.deletePagePayments).toHaveBeenCalledTimes(1);
    expect(data.deletePageSubscriptionMapping).toHaveBeenCalledTimes(1);
    expect(data.deletePageMember).toHaveBeenCalledTimes(1);
    expect(data.deletePageCustomerTags).toHaveBeenCalledTimes(1);
    expect(data.deletePage).toHaveBeenCalledTimes(1);
    expect(PostgresHelper.execBatchCommitTransaction).toHaveBeenCalledTimes(1);
  });

  test('Should successfully delete page without bank account', async () => {
    const pagesService = new PagesService();
    PlusmarService.writerClient = {} as unknown as Pool;

    mock(data, 'getPageByID', jest.fn().mockResolvedValueOnce({ wizard_step: EnumWizardStepType.STEP_SET_PAYMENT } as IPages));
    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValueOnce(new Pool()));
    mock(data, 'deletePageTax', jest.fn());
    mock(data, 'deletePageLeadForms', jest.fn());
    mock(data, 'deletePageChatTemplates', jest.fn());
    mock(data, 'deletePageLogistics', jest.fn());
    mock(data, 'listAllPayment', jest.fn().mockResolvedValueOnce([]));
    mock(data, 'getBankAccount', jest.fn());
    mock(data, 'deleteBankAccountById', jest.fn());
    mock(data, 'deletePagePayments', jest.fn());
    mock(data, 'deletePageSubscriptionMapping', jest.fn());
    mock(data, 'deletePageMember', jest.fn());
    mock(data, 'deletePageCustomerTags', jest.fn());
    mock(data, 'deletePage', jest.fn());
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValueOnce(new Pool()));

    const result = await pagesService.deletePage(1, 1);
    expect(result.status).toEqual(200);
    expect(data.getPageByID).toHaveBeenCalledTimes(1);
    expect(PostgresHelper.execBeginBatchTransaction).toHaveBeenCalledTimes(1);
    expect(data.deletePageTax).toHaveBeenCalledTimes(1);
    expect(data.deletePageLeadForms).toHaveBeenCalledTimes(1);
    expect(data.deletePageChatTemplates).toHaveBeenCalledTimes(1);
    expect(data.deletePageLogistics).toHaveBeenCalledTimes(1);
    expect(data.listAllPayment).toHaveBeenCalledTimes(1);
    expect(data.getBankAccount).not.toBeCalled();
    expect(data.deleteBankAccountById).not.toBeCalled();
    expect(data.deletePagePayments).toHaveBeenCalledTimes(1);
    expect(data.deletePageSubscriptionMapping).toHaveBeenCalledTimes(1);
    expect(data.deletePageMember).toHaveBeenCalledTimes(1);
    expect(data.deletePageCustomerTags).toHaveBeenCalledTimes(1);
    expect(data.deletePage).toHaveBeenCalledTimes(1);
    expect(PostgresHelper.execBatchCommitTransaction).toHaveBeenCalledTimes(1);
  });

  test('Should failed to delete page from wizard already success', async () => {
    const pagesService = new PagesService();
    PlusmarService.writerClient = {} as unknown as Pool;

    mock(data, 'getPageByID', jest.fn().mockResolvedValueOnce({ wizard_step: EnumWizardStepType.SETUP_SUCCESS } as IPages));
    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn());
    mock(data, 'deletePageTax', jest.fn());
    mock(data, 'deletePageLeadForms', jest.fn());
    mock(data, 'deletePageChatTemplates', jest.fn());
    mock(data, 'deletePageLogistics', jest.fn());
    mock(data, 'listAllPayment', jest.fn());
    mock(data, 'getBankAccount', jest.fn());
    mock(data, 'deleteBankAccountById', jest.fn());
    mock(data, 'deletePagePayments', jest.fn());
    mock(data, 'deletePageSubscriptionMapping', jest.fn());
    mock(data, 'deletePageMember', jest.fn());
    mock(data, 'deletePageCustomerTags', jest.fn());
    mock(data, 'deletePage', jest.fn());
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn());

    try {
      await pagesService.deletePage(1, 1);
    } catch (err) {
      expect(err).toStrictEqual(new Error(EnumWizardStepError.CANNOT_REMOVE_SETUP_SUCCESS_PAGE));
      expect(data.getPageByID).toHaveBeenCalledTimes(1);
      expect(PostgresHelper.execBeginBatchTransaction).not.toBeCalled();
      expect(data.deletePageTax).not.toBeCalled();
      expect(data.deletePageLeadForms).not.toBeCalled();
      expect(data.deletePageChatTemplates).not.toBeCalled();
      expect(data.deletePageLogistics).not.toBeCalled();
      expect(data.listAllPayment).not.toBeCalled();
      expect(data.getBankAccount).not.toBeCalled();
      expect(data.deleteBankAccountById).not.toBeCalled();
      expect(data.deletePagePayments).not.toBeCalled();
      expect(data.deletePageSubscriptionMapping).not.toBeCalled();
      expect(data.deletePageMember).not.toBeCalled();
      expect(data.deletePageCustomerTags).not.toBeCalled();
      expect(data.deletePage).not.toBeCalled();
      expect(PostgresHelper.execBatchCommitTransaction).not.toBeCalled();
    }
  });
});

describe('updateFacebookPageToken', () => {
  test('Should successfully update facebook page token', async () => {
    const pagesService = new PagesService();
    PlusmarService.writerClient = {} as unknown as Pool;
    PlusmarService.environment = { ...environmentLib, pageKey: 'WAKAKA' };
    const fbPage = {
      id: '123245',
      name: 'test',
      picture: 'aa',
      access_token: 'sdfsdf',
    } as IFacebookPageResponse;
    const page = { id: 1, fb_page_id: '123245' } as IPages;

    mock(data, 'getPageByID', jest.fn().mockResolvedValueOnce(page));
    mock(data, 'getPagesFromFacebookUser', jest.fn().mockResolvedValueOnce([fbPage]));
    mock(helpers, 'cryptoEncode', jest.fn().mockResolvedValueOnce('12354'));
    mock(data, 'setShopFanPageAccessTokenByPageID', jest.fn());
    mock(data, 'subscribePageToApp', jest.fn().mockResolvedValueOnce({ value: 'sdf' } as IHTTPResult));

    const result = await pagesService.updateFacebookPageToken(1, 'userAccessToken', 'userToken');
    expect(result.status).toEqual(200);
    expect(data.getPageByID).toHaveBeenCalledTimes(1);
    expect(data.getPagesFromFacebookUser).toHaveBeenCalledTimes(1);
    expect(helpers.cryptoEncode).toHaveBeenCalledTimes(1);
    expect(data.setShopFanPageAccessTokenByPageID).toHaveBeenCalledTimes(1);
    expect(data.subscribePageToApp).toHaveBeenCalledTimes(1);
  });
});
