import { IFacebookLeadFormPipelineModel, ILeadsFormSubmission, LeadsDomainStatus } from '@reactor-room/itopplus-model-lib';
import * as datalead from '../../data/leads';
import { mock } from '../../test/mock';
import { PipelineMessageService } from './pipeline-message.service';

jest.mock('../../data/audience-history');
jest.mock('../../data/leads');
jest.mock('../../data');
jest.mock('../../data/pipeline');
jest.mock('@reactor-room/itopplus-back-end-helpers');

describe('PipelineMessageService | getOptionParams()', () => {
  const pageID = 123;

  test('checkLeadPipeline pipeline undefined', async () => {
    const audience = 1256;
    const formID = 198;
    const func = new PipelineMessageService();
    const userID = 1;
    const customerID = 231;
    const pipeline = {
      status: LeadsDomainStatus.FOLLOW,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: '5fa8ffd8c7a64925894a8f88',
      audienceId: 1257,
      customerId: 90,
      parentAudienceId: 1256,
      pageId: 2,
      formId: 198,
      psid: '4254962181242841',
      ref: 'b015f1e9-ea27-420a-97b2-6722ebf9eec2',
      __v: 0,
    } as IFacebookLeadFormPipelineModel;

    mock(datalead, 'getFormSubmissionByAudienceID', jest.fn().mockResolvedValue(null));
    mock(datalead, 'getPendingLeadByAudienceID', jest.fn().mockResolvedValue(pipeline));
    mock(datalead, 'createReferral', jest.fn());
    const response = await func.checkLeadPipeline(audience, formID, pageID, userID, customerID);
    expect(response).toEqual(pipeline);
  });
  test('checkLeadPipeline should throw LEAD_ALREADY_ADDED', async () => {
    const audience = 1256;
    const formID = 198;
    const func = new PipelineMessageService();
    const userID = 1;
    const customerID = 231;

    mock(
      datalead,
      'getFormSubmissionByAudienceID',
      jest.fn().mockResolvedValue([
        {
          id: 1,
          page_id: 1,
          form_id: 1,
          audience_id: 1,
          options: 'a',
          created_at: 'a',
          name: 'a',
        },
      ] as ILeadsFormSubmission[]),
    );

    mock(datalead, 'getPendingLeadByAudienceID', jest.fn());
    mock(datalead, 'createReferral', jest.fn());
    try {
      await func.checkLeadPipeline(audience, formID, pageID, userID, customerID);
    } catch (ex) {
      expect(ex.message).toEqual('LEAD_ALREADY_ADDED');
    }

    expect(datalead.getPendingLeadByAudienceID).not.toBeCalled();
    expect(datalead.createReferral).not.toBeCalled();
  });

  // test('sendFormPayload pass user_id', async () => {
  //   const contextPayload = { pageID: 2, userID: 7 };
  //   const audience = 1256;
  //   const formID = 198;
  //   const psid = '4254962181242841';
  //   const func = new PipelineMessageService();
  //   const page = {
  //     id: 2,
  //     page_name: 'Khappom',
  //     tel: '0825475131',
  //     email: 'email@gmail.com',
  //     address: 'skfjdskfds',
  //     option: {
  //       access_token: 'b3be09a',
  //     },
  //   };

  //   const pipeline = {
  //     status: 'FOLLOW',
  //     createdAt: '2020-11-09T08:33:17.000Z',
  //     updatedAt: '2020-11-09T08:33:17.000Z',
  //     _id: '5fa8ffd8c7a64925894a8f88',
  //     audienceId: 1257,
  //     parentAudienceId: 1256,
  //     pageId: 2,nx run
  //     ref: 'b015f1e9-ea27-420a-97b2-6722ebf9eec2',
  //     __v: 0,
  //   };

  //   const options = { title: 'any', button: 'ok' };

  //   const payload = [
  //     {
  //       name: 'leadCustomForm',
  //       json: {
  //         recipient: '',
  //         message: '',
  //         messaging_type: 'MESSAGE_TAG',
  //         tag: 'ACCOUNT_UPDATE',
  //       },
  //     },
  //   ];

  //   mock(data, 'getPageByID', jest.fn().mockResolvedValue(page));
  //   mock(helpers, 'cryptoDecode', jest.fn().mockReturnValueOnce('TOKENTOKENTOKENTOKEN'));
  //   mock(func, 'checkLeadPipeline', jest.fn().mockReturnValueOnce(pipeline));
  //   mock(func, 'getLeadsOptionParams', jest.fn().mockReturnValueOnce(options));
  //   mock(dataPipeline, 'sendPayload', jest.fn().mockResolvedValue(payload));
  //   const pageAccessToken = await func.sendFormPayload(contextPayload, audience, psid, formID);
  //   expect(func.checkLeadPipeline).toBeCalled();
  // });
});
