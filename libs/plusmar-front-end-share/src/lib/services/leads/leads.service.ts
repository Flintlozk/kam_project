import { Injectable, OnDestroy } from '@angular/core';
import {
  AudienceLead,
  AudienceLeadContext,
  ICustomerLead,
  ILeadsForm,
  ILeadsFormComponentInput,
  ILeadsFormInput,
  ILeadsFormReferral,
  ILeadsFormSubmission,
  ILeadsFormSubmissionInput,
  ILeadsFormWithComponents,
  ILeadsManualFormInput,
  IManualRefFormInput,
  IMessageFormInput,
} from '@reactor-room/itopplus-model-lib';
import { ITableFilter } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  CANCEL_CUSTOMER_LEAD,
  CREATE_FORM,
  CREATE_FORM_COMPONENT,
  CREATE_FORM_SUBMISSION,
  CREATE_MANUAL_FORM,
  CREATE_MESSAGE_FORM,
  GET_ALL_LEAD_FORM_OF_AUDIENCE,
  GET_AUDIENCE_LEAD_CONTEXT,
  GET_FORMS_QUERY,
  GET_FORM_BY_ID_QUERY,
  GET_FORM_REFERRAL_URL,
  GET_FORM_SUBMISSION_BY_AUDIENCE_ID,
  GET_FORM_SUBMISSION_BY_FORM_ID_QUERY,
  GET_FORM_SUBMISSION_BY_ID_QUERY,
  GET_LEAD_FORM_OF_AUDIENCE,
  GET_LEAD_OF_AUDIENCE_BY_ID,
  MANUAL_INPUT_AUTOMATE_FORM,
  ON_LEAD_FORM_SUBMIT_SUBSCRIPTION,
} from './leads.query';

@Injectable({
  providedIn: 'root',
})
export class LeadsService {
  constructor(private apollo: Apollo) {}

  cancelCustomerLead(audienceID: number): Observable<ICustomerLead[]> {
    return this.apollo
      .mutate({
        mutation: CANCEL_CUSTOMER_LEAD,
        variables: {
          audienceID: audienceID,
        },
      })
      .pipe(map((x) => x.data['cancelCustomerLead']));
  }
  getAllLeadFormOfCustomer(customerID: number, filters: ITableFilter): Observable<ICustomerLead[]> {
    return this.apollo
      .query({
        query: GET_ALL_LEAD_FORM_OF_AUDIENCE,
        variables: {
          customerID: customerID,
          filters: filters,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getAllLeadFormOfCustomer']));
  }
  getLeadFormOfCustomer(audienceID: number): Observable<ICustomerLead> {
    return this.apollo
      .query({
        query: GET_LEAD_FORM_OF_AUDIENCE,
        variables: {
          audienceID,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getLeadFormOfCustomer']));
  }

  getLeadOfAudienceByID(audienceID: number): Observable<AudienceLead> {
    return this.apollo
      .query({
        query: GET_LEAD_OF_AUDIENCE_BY_ID,
        variables: {
          audienceID: audienceID,
        },
      })
      .pipe(map((x) => x.data['getLeadOfAudienceByID']));
  }

  getFormReferral(formID: number): Observable<ILeadsFormReferral> {
    return this.apollo
      .query({
        query: GET_FORM_REFERRAL_URL,
        variables: {
          formID: formID,
        },
      })
      .pipe(map((x) => x.data['getFormReferral']));
  }

  createForm(formInput: ILeadsFormInput): Observable<ILeadsForm> {
    return this.apollo
      .mutate({
        mutation: CREATE_FORM,
        variables: {
          formInput: formInput,
        },
      })
      .pipe(map((x) => x.data['createForm']));
  }
  createManualLeadForm(formInput: ILeadsManualFormInput): Observable<ILeadsForm> {
    return this.apollo
      .mutate({
        mutation: CREATE_MANUAL_FORM,
        variables: {
          formInput,
        },
      })
      .pipe(map((x) => x.data['createManualLeadForm']));
  }

  createFormSubmission(submission: ILeadsFormSubmissionInput): Observable<ILeadsForm> {
    return this.apollo
      .mutate({
        mutation: CREATE_FORM_SUBMISSION,
        variables: {
          submission: submission,
        },
      })
      .pipe(map((x) => x.data['createFormSubmission']));
  }
  manualInputAutomateForm(formInput: IManualRefFormInput): Observable<ILeadsForm> {
    return this.apollo
      .mutate({
        mutation: MANUAL_INPUT_AUTOMATE_FORM,
        variables: {
          formInput,
        },
      })
      .pipe(map((x) => x.data['manualInputAutomateForm']));
  }

  createMessageForm(message: IMessageFormInput): Observable<IMessageFormInput> {
    // any for first time
    return this.apollo
      .mutate({
        mutation: CREATE_MESSAGE_FORM,
        variables: {
          message: message,
        },
      })
      .pipe(map((x) => x.data['createMessageForm']));
  }

  createFormComponent(component: ILeadsFormComponentInput): Observable<ILeadsForm> {
    return this.apollo
      .mutate({
        mutation: CREATE_FORM_COMPONENT,
        variables: {
          component: component,
        },
      })
      .pipe(map((x) => x.data['createFormComponent']));
  }

  getForms(): Observable<ILeadsFormWithComponents[]> {
    return this.apollo
      .query({
        query: GET_FORMS_QUERY,
      })
      .pipe(map((x) => x.data['getForms']));
  }

  getFormByID(ID: number): Observable<ILeadsFormWithComponents> {
    return this.apollo
      .query({
        query: GET_FORM_BY_ID_QUERY,
        variables: {
          ID: ID,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getFormByID']));
  }

  getFormSubmissionByID(ID: number): Observable<ILeadsFormSubmission> {
    return this.apollo
      .query({
        query: GET_FORM_SUBMISSION_BY_ID_QUERY,
        variables: {
          ID,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getFormSubmissionByID']));
  }

  getFormSubmissionByFormID(ID: number): Observable<ILeadsFormSubmission> {
    return this.apollo
      .query({
        query: GET_FORM_SUBMISSION_BY_FORM_ID_QUERY,
        variables: {
          ID: ID,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getFormSubmissionByFormID']));
  }

  getFormSubmissionByAudienceID(ID: number): Observable<ILeadsFormSubmission[]> {
    return this.apollo
      .query({
        query: GET_FORM_SUBMISSION_BY_AUDIENCE_ID,
        variables: {
          ID: ID,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getFormSubmissionByAudienceID']));
  }

  getAudienceLeadContext(audienceID: number): Observable<AudienceLeadContext> {
    return this.apollo
      .query({
        query: GET_AUDIENCE_LEAD_CONTEXT,
        variables: {
          audienceID,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['getAudienceLeadContext']));
  }

  onLeadFormSubmitSubscription(audienceID: number): Observable<ILeadsFormSubmission> {
    return this.apollo
      .subscribe({
        query: ON_LEAD_FORM_SUBMIT_SUBSCRIPTION,
        variables: {
          audienceID,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['onLeadFormSubmitSubscription']));
  }
}
