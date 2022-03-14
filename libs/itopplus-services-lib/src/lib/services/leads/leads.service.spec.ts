import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import {
  AudienceDomainStatus,
  AudienceDomainType,
  IAudience,
  IFacebookLeadFormPipelineModel,
  ILeadsFormSubmissionInput,
  ILeadsManualFormInput,
  IMessageFormInput,
  LeadFormSubmissionType,
  LeadsDomainStatus,
} from '@reactor-room/itopplus-model-lib';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PlusmarService } from '..';
import * as data from '../../data';
import * as datalead from '../../data/leads';
import { mock } from '../../test/mock';
import { AudienceStepService } from '../audience-step';
import { LeadsService } from './leads.service';

let leads = new LeadsService();
let audienceStep = new AudienceStepService();
jest.mock('../../data');
jest.mock('../audience-step');
jest.mock('../../data/leads');
jest.mock('@reactor-room/itopplus-back-end-helpers');

describe('Leads service', () => {
  beforeEach(() => {
    leads = new LeadsService();
    audienceStep = leads.audienceStep;
  });
  test('leads savemessage', async () => {
    mock(
      datalead,
      'createMessageForm',
      jest.fn().mockResolvedValue({
        id: 226,
        name: 'customer form',
        audience_id: null,
        created_at: '2020-09-17T04:48:32.718Z',
        greeting_message: 'hello',
        thank_you_message: 'thank you',
        button_intput: 'enter',
        updated_at: '2020-09-17T09:05:06.640Z',
      }),
    );

    const messageInput: IMessageFormInput = {
      id: 226,
      pageid: '2',
      greeting_message: 'hello',
      thank_you_message: 'thank you',
      button_input: 'string',
    };
    const result = await leads.createMessageForm(messageInput, 226);
    expect(result.id).toEqual(226);
  });

  test('leads create manual lead form createManualLeadForm with child audience', async () => {
    const pageId = 2;
    const userID = 1;
    const leadFormInput = {
      audienceId: 1000,
      formId: 100,
      formJson: '{"name":"rtr","phoneNumber":"54545454545454"}',
      user_id: 1,
    } as ILeadsManualFormInput;

    const currentAudience = {
      domain: AudienceDomainType.AUDIENCE,
      status: AudienceDomainStatus.FOLLOW,
    } as IAudience;

    const updatedAudience = {
      domain: AudienceDomainType.AUDIENCE,
      status: AudienceDomainStatus.CLOSED,
    } as IAudience;

    const isChildAudience = {
      id: 1,
      parent_id: 2,
      domain: AudienceDomainType.LEADS,
      status: LeadsDomainStatus.FOLLOW,
    } as IAudience;

    const leadStatus = 'NEW_LEAD';
    const createLeadForm = {
      id: 200,
      page_id: 2,
      audience_id: 1000,
      form_id: 100,
      options: '[{"name":"name","value":"dasda"},{"name":"phoneNumber","value":"343434343"}]',
      created_at: '2020-11-10 04:59:51.825913',
      type: 'MANUAL_INPUT',
      status: 'NEW_LEAD',
      user_id: '1',
    };

    mock(data, 'getAudienceStatusById', jest.fn().mockResolvedValue(currentAudience));

    mock(data, 'updateParentAudience', jest.fn().mockResolvedValue(updatedAudience));
    mock(audienceStep, 'logAudienceHistory', jest.fn().mockResolvedValueOnce({}));
    mock(data, 'updateAudienceStatusByID', jest.fn().mockResolvedValue(isChildAudience));
    mock(audienceStep, 'logAudienceHistory', jest.fn().mockResolvedValueOnce({}));
    mock(datalead, 'createReferral', jest.fn());

    mock(leads, 'getLeadStatus', jest.fn().mockResolvedValueOnce(leadStatus));
    mock(datalead, 'createFormSubmission', jest.fn().mockResolvedValueOnce(createLeadForm));

    const result = await leads.createManualLeadForm(pageId, userID, leadFormInput);
    // expect(data.getAudienceStatusById).toHaveBeenCalled();
    // expect(data.updateParentAudience).toHaveBeenCalled();
    // expect(audienceStep.logAudienceHistory).toHaveBeenCalled();
    // expect(data.updateAudienceStatusByID).toHaveBeenCalled();
    // expect(audienceStep.logAudienceHistory).toHaveBeenCalled();
    expect(datalead.createReferral).toHaveBeenCalled();
    expect(leads.getLeadStatus).toHaveBeenCalled();
    expect(result).toBe(createLeadForm);
  });

  test('leads create manual lead form createManualLeadForm if no child audience', async () => {
    const pageId = 2;
    const userID = 1;
    const leadFormInput = {
      audienceId: 1000,
      formId: 100,
      formJson: '{"name":"rtr","phoneNumber":"54545454545454"}',
      user_id: 1,
    } as ILeadsManualFormInput;

    const currentAudience = {
      domain: AudienceDomainType.AUDIENCE,
      status: AudienceDomainStatus.FOLLOW,
    } as IAudience;

    const updatedAudience = {
      domain: AudienceDomainType.AUDIENCE,
      status: AudienceDomainStatus.CLOSED,
    } as IAudience;

    const childAudience = {
      id: 1,
      parent_id: 2,
      domain: AudienceDomainType.LEADS,
      status: LeadsDomainStatus.FINISHED,
    } as IAudience;

    const leadStatus = 'NEW_LEAD';
    const createLeadForm = {
      id: 200,
      page_id: 2,
      audience_id: 1000,
      form_id: 100,
      options: '[{"name":"name","value":"dasda"},{"name":"phoneNumber","value":"343434343"}]',
      created_at: '2020-11-10 04:59:51.825913',
      type: 'MANUAL_INPUT',
      status: 'NEW_LEAD',
      user_id: '1',
    };

    mock(data, 'getAudienceStatusById', jest.fn().mockResolvedValue(currentAudience));

    mock(data, 'updateParentAudience', jest.fn().mockResolvedValue(updatedAudience));
    mock(audienceStep, 'logAudienceHistory', jest.fn());
    mock(data, 'createChildAudience', jest.fn().mockResolvedValue(childAudience));
    mock(audienceStep, 'logAudienceHistory', jest.fn());

    mock(datalead, 'createReferral', jest.fn());

    mock(leads, 'getLeadStatus', jest.fn().mockResolvedValueOnce(leadStatus));
    mock(datalead, 'createFormSubmission', jest.fn().mockResolvedValueOnce(createLeadForm));

    const result = await leads.createManualLeadForm(pageId, userID, leadFormInput);

    // expect(data.getAudienceStatusById).toHaveBeenCalled();
    // expect(data.updateParentAudience).toHaveBeenCalled();
    // expect(audienceStep.logAudienceHistory).toHaveBeenCalled();
    // expect(data.createChildAudience).toHaveBeenCalled();
    // expect(audienceStep.logAudienceHistory).toHaveBeenCalled();
    expect(datalead.createReferral).toHaveBeenCalled();
    expect(leads.getLeadStatus).toHaveBeenCalled();
    expect(result).toBe(createLeadForm);
  });
});

describe('Leads service -> updateAudienceLeadFlow', () => {
  test('leads -> updateAudienceLeadFlow', async () => {
    PlusmarService.pubsub = { publish: jest.fn() } as unknown as RedisPubSub;
    const userID = null;
    const pipeline = {
      status: LeadsDomainStatus.FOLLOW,
      _id: '5faa4116fa95f50786e10d23',
      audienceId: 1279,
      customerId: 11,
      parentAudienceId: 1278,
      pageId: 2,
      formId: 198,
      psid: '4254962181242841',
      ref: 'f913bc1e-b0b6-4c8f-b263-306bb8da27f3',
      __v: 0,
    } as IFacebookLeadFormPipelineModel;
    const submissionInput = {
      audience_id: 1279,
      form_id: 198,
      options: '[{"value":"wew","name":"name"},{"value":"3232","name":"phoneNumber"}]',
    } as ILeadsFormSubmissionInput;
    const submissionType = LeadFormSubmissionType.AUTO_FORM_REF;
    const updateQuery = {
      audienceId: 1279,
      formId: '198',
      psid: '4254962181242841',
      pageId: 2,
    };
    const setQuery = { updatedAt: '2020-11-10T07:38:38Z', status: 'FINISHED' };
    const currentAudience = {
      id: 1283,
      customer_id: '485',
      page_id: 2,
      domain: 'LEADS',
      status: 'FOLLOW',
      created_at: '2020-11-10 07:45:27.988695',
      score: 50,
      parent_id: 1282,
      updated_at: '2020-11-10 07:45:27.988695',
      is_notify: false,
      last_platform_activity_date: null,
      user_id: null,
      notify_status: null,
    };

    const updatedAudience = {
      id: 1283,
      customer_id: '485',
      page_id: 2,
      domain: 'LEADS',
      status: 'FINISHED',
      created_at: '2020-11-10 07:45:27.988695',
      score: 50,
      parent_id: 1282,
      updated_at: '2020-11-10 07:45:27.988695',
      is_notify: false,
      last_platform_activity_date: null,
      user_id: null,
      notify_status: null,
    };

    const updatedParentAudience = {
      id: 1283,
      customer_id: '485',
      page_id: 2,
      domain: 'AUDIENCE',
      status: 'CLOSED',
      created_at: '2020-11-10 07:45:27.988695',
      score: 50,
      parent_id: 1282,
      updated_at: '2020-11-10 07:45:27.988695',
      is_notify: false,
      last_platform_activity_date: null,
      user_id: null,
      notify_status: null,
    };

    mock(data, 'getPageMappingData', jest.fn().mockResolvedValue({ role: 'OWNER' }));
    mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue({}));

    mock(data, 'createAudienceHistoryTransaction', jest.fn());

    mock(data, 'getAudienceStatusById', jest.fn().mockResolvedValue(currentAudience));

    mock(data, 'updateParentAudience', jest.fn().mockResolvedValue(updatedAudience));
    mock(data, 'createChildAudience', jest.fn().mockResolvedValue(updatedParentAudience));
    mock(data, 'updateAudienceDomainStatusByID', jest.fn().mockResolvedValue(updatedAudience));
    mock(data, 'createChildAudience', jest.fn().mockResolvedValue(updatedParentAudience));
    await leads.updateAudienceLeadFlow(userID, pipeline, submissionInput, submissionType);
  });
});
