Payments System 1
[OMISE]

- https://dashboard.omise.co/test/webhooks

* ask me for USER/PWD whois ME???

# [Purchase Order Sequence Diagram]

## - Possibly ways to start order

### Way 1

```mermaid
sequenceDiagram
    Customer->>+Staff: Chat
    Staff-->>-Customer: Agree to open order
    Staff->>+System: Open order
    System->>System: Update Customer Domain -> CUSTOMER
    System->>-System: Update Customer Status -> FOLLOW
    Staff-->>+Cart: Add product
    System->>+Customer: Send Card(FB,Line)
    Note over System,Customer : Start Pipeline Step 1
```

### Way 2

```mermaid
sequenceDiagram
    Customer->>+Staff: Chat
    Staff-->>-Customer: Send Product Catalog
    loop Select product
        Customer->>+Cart(Webview):Select product
    end
    Customer->>+Cart(Webview):Confirm cart
    Cart(Webview)->>+System: Open order
    Note over System,Customer : Start Pipeline Step 1
```

# - Purchase Order Pipeline Step 1

## - Step 1

```mermaid
sequenceDiagram
    Customer->>+Chat: Click some button to open webview
    Chat->>+Order(Webview): Open webview
    Order(Webview)->>+System: Request webview
    System->>-System:update Customer status to WAITING_FOR_PAYMENT
    System-->>+Order(Webview): Response webiview
    Customer->>+Order(Webview): Fill address detail
    alt logistic system enabled
        Customer->>+Order(Webview): Select logistic
        Order(Webview)->>+System: Update order's logistic (SELECT_LOGISTIC_METHOD)
    else logistic system disabled
        Order(Webview)->>+Customer: Skip
    end
    Customer->>+Order(Webview): Select payment
    Order(Webview)->>+ System: Update order's payment (SELECT_PAYMENT_METHOD)
    Customer->>+Order(Webview): Confirm and Checkout
    note over Customer,Order(Webview): Check "CONFIRM_PAYMENT_SELECTION" diagram for more detail
```

## - Step 1 (Extra CONFIRM_PAYMENT_SELECTION)

```mermaid
sequenceDiagram
    note over Order(Webview),System: After click confirm order and Checkout (3rd party)
    Order(Webview)->>+System: update customer address (UPDATE_DELIVERY_ADDRESS)
    System-->>-Order(Webview): Response result
    Order(Webview)->>+System: verify order context (VERIFY_ORDER_CONTEXT)
    System-->>-Order(Webview): Response result
    opt Invalid order context
        Order(Webview)-->>+Order(Webview): Alert and reload page
    end
        Order(Webview)->>-System: check product avalidable (CHECK_PRODUCT_SUFFICIENT)
    opt Product unavaliable
        Order(Webview)-->>+Order(Webview): Alert and reload page
    end
    Order(Webview)->>- Order(Webview): start to checkout by user choice
    Order(Webview)->>+ System: confirm payment (CONFIRM_PAYMENT_SELECTION)
    note over Order(Webview),System: For the detail of each payment will provide on another diagram
```
