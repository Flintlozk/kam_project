import gql from 'graphql-tag';

export const SAVE_QUICK_PAY = gql`
  mutation saveQuickPay($audienceID: Int, $vat: Float, $quickPayBillInput: QuickPayBillSaveInput) {
    saveQuickPay(audienceID: $audienceID, vat: $vat, quickPayBillInput: $quickPayBillInput) {
      status
      value
    }
  }
`;

export const QUICK_PAY_PAYMENT_CANCEL = gql`
  mutation quickPayPaymentCancel($id: Int, $description: String) {
    quickPayPaymentCancel(id: $id, description: $description) {
      status
      value
    }
  }
`;

export const GET_QUICK_PAY_LIST = gql`
  query getQuickPayList($audienceID: Int, $customerID: Int, $filters: TableFilterInput) {
    getQuickPayList(audienceID: $audienceID, customerID: $customerID, filters: $filters) {
      id
      totalPrice
      tax
      status
      audienceID
      discount
      is_cancel
      is_paid
      paymentMode
      createdAt
      expiredAt
      isExpired
      totalrows
      description
    }
  }
`;

export const GET_QUICK_PAY_ORDER_ITEMS = gql`
  query getQuickPayOrderItemsByOrderID($id: Int) {
    getQuickPayOrderItemsByOrderID(id: $id) {
      id
      name
      purchaseOrderID
      audienceID
      itemPrice
      discount
      isVat
    }
  }
`;

export const GET_QUICK_PAY_CANCEL_DETAILS = gql`
  query getQuickPayCancelDetails($id: Int) {
    getQuickPayCancelDetails(id: $id) {
      id
      isCancel
      cancelReason
      userName
      updatedAt
    }
  }
`;

export const GET_QUICK_PAY_PAYMENT_DETAILS = gql`
  query getQuickPayPaymentDetails($id: Int) {
    getQuickPayPaymentDetails(id: $id) {
      id
      isPaid
      paymentMethod
      paidAmount
      paidDate
      paidTime
      paidProof
      isWithHoldingTax
      withHoldingTax
    }
  }
`;

export const SAVE_QUICK_PAY_PAYMENT = gql`
  mutation saveQuickPayPayment($id: Int, $quickPayPaymentInput: QuickPayPaymentInput) {
    saveQuickPayPayment(id: $id, quickPayPaymentInput: $quickPayPaymentInput) {
      status
      value
    }
  }
`;

export const SEND_QUICK_PAY_TO_CHATBOX = gql`
  mutation sendQuickPayToChatBox($quickPayID: Int, $audienceID: Int, $PSID: String) {
    sendQuickPayToChatBox(quickPayID: $quickPayID, audienceID: $audienceID, PSID: $PSID) {
      status
      value
    }
  }
`;
