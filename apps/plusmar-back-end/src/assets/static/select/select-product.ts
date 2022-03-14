import { IPipelineSelectProduct, IProductVariantPipeline, IPurchaseOrderPostbackAddProductViaShareLink, PurchaseOrderPostbackPayload } from '@reactor-room/itopplus-model-lib';
// eslint-disable-next-line
declare let payloadData: IPipelineSelectProduct;
// eslint-disable-next-line
declare const MessengerExtensions: any;
// eslint-disable-next-line
declare const POST: (path: string, body: PurchaseOrderPostbackPayload, callback: () => void) => void;
// eslint-disable-next-line
declare const getQueryParams: any;
// eslint-disable-next-line
declare const liff: any;
// eslint-disable-next-line
declare let variant: number;

// eslint-disable-next-line
function addSingleProductToCart(variant: number) {
  const quantity = Number((<HTMLInputElement>document.getElementById('quantity')).value);
  if (!quantity || quantity < 1) {
    setDefaultOnZero();
  }
  const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
  const queryParams = getQueryParams('ADD_PRODUCT_VIA_SHARE_LINK', PSID);

  const body = {
    quantity,
    variant,
  } as IPurchaseOrderPostbackAddProductViaShareLink;

  const button = <HTMLButtonElement>document.getElementById('add-to-cart-button');
  const added = <HTMLButtonElement>document.getElementById('added-button');
  button.disabled = true;
  POST(`purchase/postback?${queryParams}`, body, function () {
    button.innerHTML = 'Added';
    added.style.display = 'block';

    if (typeof MessengerExtensions !== 'function') {
      onCloseSuccessMessage();
    } else {
      MessengerExtensions.requestCloseBrowser();
    }
  });
}

// eslint-disable-next-line
function addItemToCart(variantID) {
  const selectedVariant = getMultipleVariant(variantID);
  const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
  const queryParams = getQueryParams('ADD_PRODUCT_VIA_SHARE_LINK', PSID);

  const body = {
    quantity: 1,
    variant: selectedVariant.variantID,
  } as IPurchaseOrderPostbackAddProductViaShareLink;

  POST(`purchase/postback?${queryParams}`, body, function () {
    if (typeof MessengerExtensions !== 'function') {
      onCloseSuccessMessage();
    } else {
      MessengerExtensions.requestCloseBrowser();
    }
  });
}

function getMultipleVariant(variantID) {
  const variantData = payloadData.product as IProductVariantPipeline[];
  let variantFound = null;
  for (let i = 0; i < variantData.length; i++) {
    const variant = variantData[i];
    if (variant.variantID == variantID) {
      variantFound = variant;
    }
  }
  return variantFound;
}

function onCloseSuccessMessage(): void {
  MessengerExtensions.requestCloseBrowser(
    function () {
      // close
    },
    function err(err) {
      window.close();
    },
  );
}

function getVariant(): IProductVariantPipeline {
  return payloadData.product as IProductVariantPipeline;
}
// eslint-disable-next-line
function increaseVariantQuantity() {
  const variantOption = getVariant();
  const quantity = <HTMLButtonElement>document.getElementById('quantity');
  const val = Number(quantity.value);
  if (val < variantOption.variantInventory) {
    quantity.value = String(val + 1);
    setPrice();
  }
}
// eslint-disable-next-line
function decreaseVariantQuantity() {
  const quantity = <HTMLButtonElement>document.getElementById('quantity');
  const val = Number(quantity.value);
  if (val > 1) {
    quantity.value = String(val - 1);
    setPrice();
  }
}
// eslint-disable-next-line
function onInputQuantity(amount: string) {
  const variantOption = getVariant();
  if (Number(amount) > Number(variantOption.variantInventory)) {
    const quantity = <HTMLButtonElement>document.getElementById('quantity');
    quantity.value = String(variantOption.variantInventory);
    setPrice();
  } else {
    setPrice();
  }
}

function setDefaultOnZero() {
  const quantity = <HTMLButtonElement>document.getElementById('quantity');
  quantity.value = '1';
  setPrice();
}

function setPrice() {
  const variantOption = getVariant();
  const quantity = <HTMLButtonElement>document.getElementById('quantity');
  const price = document.getElementById('price');
  const total = document.getElementById('total');
  const variantPrice = Number(variantOption.variantUnitPrice);

  const shipping = 0;
  price.innerHTML = `฿ ${variantPrice * Number(quantity.value)}`;
  total.innerHTML = `฿ ${variantPrice * Number(quantity.value) + shipping}`;
}

// eslint-disable-next-line
function getForm(): HTMLElement {
  const formId = 'form';
  const form = document.getElementById(formId);
  return form;
}
