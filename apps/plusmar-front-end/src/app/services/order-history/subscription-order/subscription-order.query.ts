import gql from 'graphql-tag';

export const GET_HASH_VALUE = gql`
  query getHashValue($requestPaymentData: RequestPaymentDataInput) {
    getHashValue(requestPaymentData: $requestPaymentData) {
      hash_value
      charge_next_date
      order_detail {
        version
        merchant_id
        result_url_1
        result_url_2
        request_3ds
        redirect_api
      }
    }
  }
`;

export const CREATE_SUBSCRIPTION_ORDER = gql`
  mutation createSubscriptionOrder($subscriptionPlanID: Int, $orderDetails: SubscriptionOrderInput, $subscriptionID: String) {
    createSubscriptionOrder(subscriptionPlanID: $subscriptionPlanID, orderDetails: $orderDetails, subscriptionID: $subscriptionID) {
      id
      subscription_id
      recurring_amount
    }
  }
`;
