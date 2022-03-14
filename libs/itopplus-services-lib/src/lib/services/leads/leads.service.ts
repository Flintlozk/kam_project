import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import {
  AudienceLead,
  ICustomerLead,
  IFacebookLeadFormPipelineModel,
  ILeadsForm,
  ILeadsFormComponent,
  ILeadsFormComponentInput,
  ILeadsFormInput,
  ILeadsFormReferral,
  ILeadsFormSubmission,
  ILeadsFormSubmissionInput,
  ILeadsFormWithComponents,
  ILeadsManualFormInput,
  IManualRefFormInput,
  IMessageFormInput,
  LeadFormSubmissionType,
  LeadsDomainStatus,
  LEAD_FORM_SUBMIT_WEBVIEW,
} from '@reactor-room/itopplus-model-lib';
import { IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import { isEmpty } from 'lodash';
import {
  cancelCustomerLeadForm,
  createForm,
  createFormComponent,
  createFormSubmission,
  createMessageForm,
  createReferral,
  getAudiencesLead,
  getCustomerAllLeads,
  getCustomerLead,
  getFinishedLeadByAudienceIDWithoutRef,
  getFormByID,
  getFormComponentsByFormID,
  getFormNameByID,
  getFormReferralByFormID,
  getFormsByPageID,
  getFormSubmissionByAudienceID,
  getFormSubmissionByFormID,
  getFormSubmissionByID,
  getLeadPipeline,
  getLeadPipelineByParentID,
  getLeadStatusFromInput,
  getPendingLeadByAudienceID,
  getReferral,
} from '../../data/leads';
import { AudienceStepService } from '../audience-step';
import { LeadsInitializeService } from '../initialize';
import { PlusmarService } from '../plusmarservice.class';

export class LeadsService {
  public audienceStep: AudienceStepService;

  constructor() {
    this.audienceStep = new AudienceStepService();
  }

  async checkLeadFollowBeforeCloseAudience(pageID: number, audienceID: number) {
    const lead = await getPendingLeadByAudienceID(PlusmarService.readerClient, audienceID, pageID);
    if (!isEmpty(lead)) {
      throw new Error('LEAD_FOLLOW_EXIST');
    }
  }

  async getLeadPipeline(childAudienceID: number, pageID: number, formRef: string): Promise<IFacebookLeadFormPipelineModel> {
    // ? being used at webhook-template.service
    return await getLeadPipeline(PlusmarService.readerClient, childAudienceID, pageID, formRef);
  }

  async createForm(formInput: ILeadsFormInput): Promise<ILeadsForm> {
    return await createForm(PlusmarService.readerClient, Object.assign(formInput));
  }

  async cancelCustomerLead(pageID: number, audienceID: number): Promise<IHTTPResult> {
    const submission = await getFinishedLeadByAudienceIDWithoutRef(PlusmarService.readerClient, audienceID, pageID);
    if (!isEmpty(submission)) throw new Error('LEAD_ALREADY_ADDED');

    await cancelCustomerLeadForm(PlusmarService.writerClient, pageID, audienceID);
    return await Promise.resolve({ status: 200, value: 'OK' });
  }
  async createManualLeadForm(pageId: number, userID: number, input: ILeadsManualFormInput): Promise<ILeadsFormSubmission> {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    try {
      const { customerId, audienceId, formId, formJson, user_id } = input;
      const parseJson = JSON.parse(formJson);
      const keys = Object.keys(parseJson);
      const submission = await getFormSubmissionByAudienceID(PlusmarService.readerClient, audienceId, pageId);
      if (!isEmpty(submission)) throw new Error('LEAD_ALREADY_ADDED');

      const formValue = [];
      keys.map((key) => {
        formValue.push({
          name: key,
          value: parseJson[key],
        });
      });

      const submissionInput: ILeadsFormSubmissionInput = {
        customer_id: customerId,
        audience_id: audienceId,
        form_id: formId,
        options: JSON.stringify(formValue) as string,
      };

      await createReferral(client, {
        form_id: formId,
        page_id: pageId,
        audience_id: audienceId,
        customer_id: customerId,
      });

      const leadStatus = await this.getLeadStatus(submissionInput, pageId);
      const formSubmission = await createFormSubmission(client, submissionInput, pageId, LeadFormSubmissionType.MANUAL_INPUT, leadStatus, user_id);
      await PostgresHelper.execBatchCommitTransaction(client);

      return formSubmission;
    } catch (ex) {
      await PostgresHelper.execBatchRollbackTransaction(client);
      throw ex;
    }
  }

  async manualInputAutomateForm({ audienceId, formJson, formId }: IManualRefFormInput, pageID: number, userID: number): Promise<void> {
    const pipeline = await getLeadPipelineByParentID(PlusmarService.readerClient, audienceId, pageID, LeadsDomainStatus.FOLLOW);
    const formInputs = [];
    const forms = JSON.parse(formJson);
    for (let i = 0; i < forms.length; i++) {
      const input = forms[i];
      formInputs.push({
        name: input.options.controlName,
        value: input.value,
      });
    }

    const submissionInput: ILeadsFormSubmissionInput = Object.assign({ audience_id: pipeline.audienceId, form_id: pipeline.formId, options: JSON.stringify(formInputs) });
    await this.updateAudienceLeadFlow(userID, pipeline, submissionInput, LeadFormSubmissionType.MANUAL_FORM_REF);
  }

  async updateAudienceLeadFlow(
    userID: number,
    pipeline: IFacebookLeadFormPipelineModel,
    submissionInput: ILeadsFormSubmissionInput,
    submissionType: LeadFormSubmissionType,
  ): Promise<void> {
    const { pageId: pageID } = pipeline;
    const leadStatus = await this.getLeadStatus(submissionInput, pageID);
    const leadFormData = await createFormSubmission(PlusmarService.writerClient, submissionInput, pageID, submissionType, leadStatus, userID);
    await this.sendLeadFormDataToSubscription(leadFormData);
  }

  async sendLeadFormDataToSubscription(leadFormData: ILeadsFormSubmission): Promise<void> {
    await PlusmarService.pubsub.publish(LEAD_FORM_SUBMIT_WEBVIEW, { onLeadFormSubmitSubscription: leadFormData });
  }

  async getLeadOfAudienceByID(pageID: number, audienceID: number): Promise<AudienceLead> {
    return await getAudiencesLead(PlusmarService.readerClient, pageID, audienceID);
  }
  async getAllLeadFormOfCustomer(pageID: number, customerID: number, filters: ITableFilter): Promise<ICustomerLead[]> {
    if (isEmpty(filters.search)) filters.search = null;
    const { search, currentPage, pageSize } = filters;
    const page: number = (currentPage - 1) * pageSize;

    const lists = await getCustomerAllLeads(PlusmarService.readerClient, pageID, customerID, page, pageSize, search);
    if (lists.length > 0) return lists;
    else return [];
  }
  async getLeadFormOfCustomer(pageID: number, audienceID: number): Promise<ICustomerLead> {
    const lists = await getCustomerLead(PlusmarService.readerClient, pageID, audienceID);

    return lists;
  }

  async createFormComponent(component: ILeadsFormComponentInput): Promise<ILeadsFormComponent> {
    return await createFormComponent(PlusmarService.readerClient, component);
  }

  async createMessageForm(message: IMessageFormInput, pageID: number): Promise<IMessageFormInput> {
    return await createMessageForm(PlusmarService.readerClient, message, pageID);
  }
  async getForms(pageID: number): Promise<ILeadsFormWithComponents> {
    let forms = await getFormsByPageID(PlusmarService.readerClient, pageID);
    if (isEmpty(forms)) {
      const leadsFormInit = new LeadsInitializeService();
      forms = await leadsFormInit.initLeadForm(PlusmarService.writerClient, pageID);
    }

    let formComponentPromises = await Promise.all([...forms.map((form) => getFormComponentsByFormID(PlusmarService.readerClient, form.id, pageID))]);
    if (formComponentPromises.length < 1) {
      const leadsFormInit = new LeadsInitializeService();
      forms = await leadsFormInit.initLeadForm(PlusmarService.writerClient, pageID);
      formComponentPromises = await Promise.all([...forms.map((form) => getFormComponentsByFormID(PlusmarService.readerClient, form.id, pageID))]);
    }

    const result = forms.map((form, i) => {
      return Object.assign({
        ...form,
        components: [...formComponentPromises[i]],
      });
    });

    return result as unknown as ILeadsFormWithComponents;
  }

  async getFormByID(ID: number, pageID: number): Promise<ILeadsFormWithComponents> {
    const [form, components] = await Promise.all([getFormByID(PlusmarService.readerClient, ID, pageID), getFormComponentsByFormID(PlusmarService.readerClient, ID, pageID)]);
    const result = {
      ...form,
      components: [...components],
    } as ILeadsFormWithComponents;
    return result;
  }

  async getFormNameByID(ID: number, pageID: number): Promise<ILeadsForm> {
    return await getFormNameByID(PlusmarService.readerClient, ID, pageID);
  }

  async getFormSubmissionByID(ID: number, pageID: number): Promise<ILeadsFormSubmission> {
    return await getFormSubmissionByID(PlusmarService.readerClient, ID, pageID);
  }

  async getFormSubmissionByFormID(ID: number, pageID: number): Promise<ILeadsFormSubmission> {
    return await getFormSubmissionByFormID(PlusmarService.readerClient, ID, pageID);
  }

  async getFormSubmissionByAudienceID(ID: number, pageID: number): Promise<ILeadsFormSubmission[]> {
    return await getFormSubmissionByAudienceID(PlusmarService.readerClient, ID, pageID);
  }

  async getFormReferral(formID: number, pageID: number): Promise<ILeadsFormReferral> {
    return await getFormReferralByFormID(PlusmarService.readerClient, formID, pageID);
  }

  async getReferral(ref: string): Promise<ILeadsFormReferral> {
    return await getReferral(PlusmarService.readerClient, ref);
  }

  async getLeadStatus(lead: ILeadsFormSubmissionInput, pageID: number): Promise<string> {
    const parseOptionJson = JSON.parse(lead.options);
    const submitname = parseOptionJson.find((form) => form.name === 'name');
    const submitmobile = parseOptionJson.find((form) => form.name === 'phoneNumber');
    const submitemail = parseOptionJson.find((form) => form.name === 'email');
    return await getLeadStatusFromInput(PlusmarService.readerClient, `%${submitname?.value}`, `%${submitmobile?.value}`, `%${submitemail?.value}`, pageID);
  }
}
