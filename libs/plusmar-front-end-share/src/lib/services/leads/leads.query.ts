import gql from 'graphql-tag';

export const CREATE_FORM = gql`
  mutation createForm($formInput: LeadsFormInput) {
    createForm(formInput: $formInput) {
      id
    }
  }
`;
export const CREATE_MANUAL_FORM = gql`
  mutation createManualLeadForm($formInput: LeadsManualFormInput) {
    createManualLeadForm(formInput: $formInput) {
      id
    }
  }
`;

export const CREATE_FORM_SUBMISSION = gql`
  mutation createFormSubmission($submission: LeadsFormSubmissionInput) {
    createFormSubmission(submission: $submission) {
      id
      page_id
      form_id
      options
      created_at
      audience_id
    }
  }
`;
export const MANUAL_INPUT_AUTOMATE_FORM = gql`
  mutation manualInputAutomateForm($formInput: ManualRefFormInput) {
    manualInputAutomateForm(formInput: $formInput) {
      id
      page_id
      form_id
      options
      created_at
      audience_id
    }
  }
`;

export const CREATE_FORM_COMPONENT = gql`
  mutation createFormComponent($component: LeadsFormComponentInput) {
    createFormComponent(component: $component) {
      id
      form_id
      type
      index
    }
  }
`;
export const CREATE_MESSAGE_FORM = gql`
  mutation createMessageForm($message: MessageFormInput) {
    createMessageForm(message: $message) {
      greeting_message
      thank_you_message
    }
  }
`;

export const GET_FORM_REFERRAL_URL = gql`
  query getFormReferral($formID: Int) {
    getFormReferral(formID: $formID) {
      id
      form_id
      page_id
      ref
      created_at
    }
  }
`;

export const GET_LEAD_OF_AUDIENCE_BY_ID = gql`
  query getLeadOfAudienceByID($audienceID: Int) {
    getLeadOfAudienceByID(audienceID: $audienceID) {
      form_id
      ref
    }
  }
`;
export const CANCEL_CUSTOMER_LEAD = gql`
  mutation cancelCustomerLead($audienceID: Int) {
    cancelCustomerLead(audienceID: $audienceID) {
      value
      status
    }
  }
`;
export const GET_ALL_LEAD_FORM_OF_AUDIENCE = gql`
  query getAllLeadFormOfCustomer($customerID: Int, $filters: TableFilterInput) {
    getAllLeadFormOfCustomer(customerID: $customerID, filters: $filters) {
      formName
      audienceID
      customerID
      updatedAt
      options {
        value
        name
      }
      isFollow
      totalrows
    }
  }
`;
export const GET_LEAD_FORM_OF_AUDIENCE = gql`
  query getLeadFormOfCustomer($audienceID: Int) {
    getLeadFormOfCustomer(audienceID: $audienceID) {
      formName
      audienceID
      customerID
      updatedAt
      options {
        value
        name
      }
      isFollow
      totalrows
    }
  }
`;

export const GET_FORMS_QUERY = gql`
  query getForms {
    getForms {
      id
      name
      page_id
      audience_id
      created_at
      components {
        id
        form_id
        type
        index
        options {
          label
          controlName
          translation {
            langID
            langValue
            langName
            default
          }
          validation {
            rules
            errorMessage
            translation {
              langID
              langValue
              langName
              default
            }
          }
        }
      }
    }
  }
`;

export const GET_FORM_BY_ID_QUERY = gql`
  query getFormByID($ID: Int) {
    getFormByID(ID: $ID) {
      id
      name
      page_id
      audience_id
      created_at
      greeting_message
      thank_you_message
      button_input
      description
      components {
        id
        form_id
        type
        index
        options {
          label
          controlName
          translation {
            langID
            langValue
            default
          }
          validation {
            rules
            errorMessage
            translation {
              langID
              langValue
              default
            }
          }
        }
      }
    }
  }
`;

export const GET_FORM_SUBMISSION_BY_ID_QUERY = gql`
  query getFormSubmissionByID($ID: Int) {
    getFormSubmissionByID(ID: $ID) {
      id
      page_id
      form_id
      options
      user_id
      created_at
      name
    }
  }
`;

export const GET_FORM_SUBMISSION_BY_FORM_ID_QUERY = gql`
  query getFormSubmissionByFormID($ID: Int) {
    getFormSubmissionByFormID(ID: $ID) {
      id
      page_id
      form_id
      options
    }
  }
`;

export const GET_FORM_SUBMISSION_BY_AUDIENCE_ID = gql`
  query getFormSubmissionByAudienceID($ID: Int) {
    getFormSubmissionByAudienceID(ID: $ID) {
      id
      page_id
      form_id
      options
    }
  }
`;
export const GET_AUDIENCE_LEAD_CONTEXT = gql`
  query getAudienceLeadContext($audienceID: Int) {
    getAudienceLeadContext(audienceID: $audienceID) {
      audienceID
      parentID
      formID
      submissionID
      refID
    }
  }
`;

export const ON_LEAD_FORM_SUBMIT_SUBSCRIPTION = gql`
  subscription onLeadFormSubmitSubscription($audienceID: Int) {
    onLeadFormSubmitSubscription(audienceID: $audienceID) {
      id
      page_id
      audience_id
      form_id
      options
    }
  }
`;
