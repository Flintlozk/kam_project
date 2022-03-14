import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import {
  EnumLeadPayloadType,
  ILeadPostbackForm,
  ILeadsFormSubmissionInput,
  IPayload,
  LeadFormSubmissionType,
  LeadPostbackMessage,
  ViewRenderType,
  WebviewTokenPayload,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { getFinishedLeadByAudienceID, getFormByID, getFormSubmissionByAudienceID, getPendingLeadByAudienceID } from '../../data/leads';
import { checkOrigin } from '../../domains/auth';
import { PipelineOnHandlePostbackButtonError } from '../../errors';
import { AuthService } from '../auth';
import { CustomerService } from '../customer';
import { PipelineMessageService } from '../pipeline';
import { PlusmarService } from '../plusmarservice.class';
import { LeadsService } from './leads.service';

export class LeadsPostbackMessageService {
  public pipelineMessageService: PipelineMessageService;
  public leadsService: LeadsService;
  public authService: AuthService;
  public customerService: CustomerService;
  constructor() {
    this.pipelineMessageService = new PipelineMessageService();
    this.leadsService = new LeadsService();
    this.authService = new AuthService();
    this.customerService = new CustomerService();
  }

  handlePostbackMessages = async (req: Request): Promise<void> => {
    checkOrigin(PlusmarService.environment.backendUrl, req.headers as IncomingHttpHeaders);
    const params = new Object(req.query) as LeadPostbackMessage;
    const { response_type, auth } = params;

    const credential = await this.authService.getCredentialFromToken(auth);
    try {
      switch (response_type) {
        case EnumLeadPayloadType.CUSTOM_FORM: {
          const message = new Object(req.body) as ILeadPostbackForm;
          await this.onResponseSubmitForm(params, message, credential);
          break;
        }
        default: {
          break;
        }
      }
    } catch (err) {
      console.log('err [LOG]:--> ', err);
      const error = new PipelineOnHandlePostbackButtonError(err);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
      throw error;
    }
  };

  async onResponseSubmitForm({ psid }: LeadPostbackMessage, { formId, formJson, ref, view }: ILeadPostbackForm, { pageID, audienceID }: WebviewTokenPayload): Promise<void> {
    psid = psid === '' ? null : psid;
    const pipeline = await getPendingLeadByAudienceID(PlusmarService.readerClient, audienceID, pageID);

    const { audienceId, customerId } = pipeline;
    const context = { pageID };
    const isLeadFormExists = await getFinishedLeadByAudienceID(PlusmarService.readerClient, audienceID, pageID, ref);

    if (isLeadFormExists !== null) {
      const leadSubmittedMessage = 'Details already saved by the page';
      await this.handlePlatFormMessage(context, psid, leadSubmittedMessage, view, audienceId);
    } else {
      const submissionInput: ILeadsFormSubmissionInput = { customer_id: customerId, audience_id: audienceId, form_id: Number(formId), options: formJson };

      const userIDForWebhook = null;
      await this.leadsService.updateAudienceLeadFlow(userIDForWebhook, pipeline, submissionInput, LeadFormSubmissionType.AUTO_FORM_REF);
      await this.customerService.updatePDPAConsentAcceptance(customerId, pageID, { TERMS: true, PRIVACY: true, DATA_USE: false });
      const { thank_you_message } = await getFormByID(PlusmarService.readerClient, Number(formId), pageID);
      const getResponseText = thank_you_message !== '' ? thank_you_message : 'Thank you, We have received your contact.'; // MOCK // TODO : Get Advance Message
      await this.handlePlatFormMessage(context, psid, getResponseText, view, audienceId);
    }
  }

  async handlePlatFormMessage(payload: IPayload, PSID: string, text: string, viewtype: ViewRenderType, audienceID: number): Promise<void> {
    switch (viewtype) {
      case ViewRenderType.LINE_LIFF:
        await this.pipelineMessageService.sendLinePayloadData(payload, text, 'sendMessageConfirmEventUpdatePayload', audienceID);
        break;
      default:
        await this.pipelineMessageService.sendMessagePayload(payload, text, audienceID);
        break;
    }
  }
}
