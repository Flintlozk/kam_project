import gql from 'graphql-tag';

export const GET_MARKET_PLACE_ORDER_DETAILS = gql`
  query getMarketPlaceOrderDetails($marketPlaceOrderID: String, $orderChannel: String) {
    getMarketPlaceOrderDetails(marketPlaceOrderID: $marketPlaceOrderID, orderChannel: $orderChannel) {
      id
      marketPlaceOrderID
      status
      totalPrice
      paymentMethod
      itemCount
      shippingFee
      marketOrderStatus
      createdAt
      customerName
      orderItems {
        sku
        discount
        productID
        name
        quantity
        unitPrice
        productImage
        productVariantID
        productMarketLink
        purchaseOrderItemID
      }
    }
  }
`;
