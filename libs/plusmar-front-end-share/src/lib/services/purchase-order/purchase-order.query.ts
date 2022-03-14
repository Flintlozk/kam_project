import gql from 'graphql-tag';

export const GET_PURCHASE_ORDER_FAILED_HISTORY = gql`
  query getPurchaseOrderFailedHistory($audienceID: Int, $orderID: Int) {
    getPurchaseOrderFailedHistory(audienceID: $audienceID, orderID: $orderID) {
      typename
      isFixed
    }
  }
`;
export const GET_PURCHASE_ORDER_UNREFUNDED_PAYMENT_INFO = gql`
  query getPurchasingOrderUnrefundedPaymentInfo($orderID: Int) {
    getPurchasingOrderUnrefundedPaymentInfo(orderID: $orderID) {
      id
      purchase_order_id
      payment_id
      type
      transaction_id
      is_refund
    }
  }
`;
export const GET_PURCHASE_ORDER = gql`
  query getPurchaseOrder($audienceId: Int, $currentStatus: String) {
    getPurchaseOrder(audienceId: $audienceId, currentStatus: $currentStatus) {
      orderId
      uuid
      audienceId
      totalPrice
      status
      tax
      taxIncluded
      isAuto
      aliasOrderId
      shipping {
        id
        name
        type
        trackingType
        flatRate
        deliveryFee
        trackingUrl
        trackingNo
        isAutoGeneratyeTrackingNo
        isActive
      }
      customerDetail {
        ... on PurchaseOrderCustomerDetail {
          name
          phoneNumber
          isConfirm
          location {
            postCode
            district
            city
            province
            address
            country
          }
        }
      }
      createdAt
      payment {
        id
        type
        bankAccountId
        bank {
          id
          payment_id
          branch_name
          account_name
          account_id
          status
          type
        }
        isPaid
        paidAmount
        paidDate
        paidTime
        paidProof
      }
      flatRate
      deliveryFee
      products {
        orderItemId
        variantId
        productName
        images {
          id
          selfLink
          mediaLink
        }
        attributes
        unitPrice
        quantity
      }
      errors {
        ... on PurchaseOrderErrors {
          typename
          isFixed
        }
      }
    }
  }
`;
export const GET_PURCHASE_ORDER_SHIPPING_DETAIL = gql`
  query getPurchaseOrderShippingDetail($orderId: Int, $audienceId: Int) {
    getPurchaseOrderShippingDetail(orderId: $orderId, audienceId: $audienceId) {
      id
      name
      type
      trackingType
      flatRate
      deliveryFee
      trackingUrl
      trackingNo
      isAutoGeneratyeTrackingNo
      isActive
    }
  }
`;

export const GET_PURCHASE_ORDER_PAYMENT_DETAIL = gql`
  query getPurchaseOrderPaymentDetail($orderId: Int, $audienceId: Int) {
    getPurchaseOrderPaymentDetail(orderId: $orderId, audienceId: $audienceId) {
      id
      type
      bankAccountId
      bank {
        id
        payment_id
        branch_name
        account_name
        account_id
        status
        type
      }
      isPaid
      paidAmount
      paidDate
      paidTime
      paidProof
    }
  }
`;

export const GET_PURCHASE_ORDER_SUBSCRIPTION = gql`
  subscription getPurchaseOrderSubscription($audienceID: Int, $orderID: Int) {
    getPurchaseOrderSubscription(audienceID: $audienceID, orderID: $orderID) {
      audienceID
      orderID
    }
  }
`;
