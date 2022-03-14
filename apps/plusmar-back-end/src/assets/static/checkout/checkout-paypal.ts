import { IPipelineStep2Combined, PurchaseOrderPostbackPayload } from '@reactor-room/itopplus-model-lib';

declare let payloadData: IPipelineStep2Combined;
declare let paypalInit: boolean;
declare const initPaypalScript: HTMLElement;
declare let enableConfirm: boolean;
// eslint-disable-next-line
declare const POST: (path: string, body: PurchaseOrderPostbackPayload, callback: (params: any) => void) => void;
// eslint-disable-next-line
declare const MessengerExtensions: any;
// eslint-disable-next-line
declare const getQueryParams: any;
// eslint-disable-next-line
declare const verifyOrderContext: (callback: (params: boolean) => void) => void;
// eslint-disable-next-line
declare const checkIsProductSufficient: (callback: (params: boolean) => void) => void;

window.onload = function (): void {
  const paypalGroup = document.getElementById('paypal-group');
  if (paypalGroup) paypalGroup.style.display = 'block';
  toggleLoader(true);
  if (!paypalInit) checkPaypalTransaction();
  toggleSummaryDetails();
};

function toggleLoader(bool: boolean): void {
  document.getElementById('loader').style.display = bool ? 'flex' : 'none';
}

function checkPaypalTransaction(): void {
  verifyOrderContext((pass) => {
    if (pass) {
      checkIsProductSufficient((yes) => {
        toggleLoader(false);
        if (yes) {
          paypalInit = true;
          disableConfirmButton();
          hideConfirmButton();
          toggleLoader(false);
          showSummary();
          document.head.appendChild(initPaypalScript);
        }
      });
    }
  });
}

function hideConfirmButton(): void {
  const button = <HTMLButtonElement>document.getElementById('step2-confirm-button');
  button.style.display = 'none';
  // setWrapperHeight(false);
}

function disableConfirmButton(): void {
  // eslint-disable-next-line
  enableConfirm = false;
  const button = <HTMLButtonElement>document.getElementById('step2-confirm-button');
  if (button) {
    button.setAttribute('disabled', 'disabled');
    button.classList.add('confirm-disable');
  }
}

// eslint-disable-next-line
function toggleSummaryDetails(): void {
  const summaryNode = document.querySelector('.js-summary-details');
  const addressNode = document.querySelector('.js-summary-address');
  const isOpened = summaryNode.classList.contains('h-full');
  const actionHandler = (flag): 'add' | 'remove' => (flag ? 'add' : 'remove');

  summaryNode.classList[actionHandler(isOpened)]('h-0', 'pb-10');
  summaryNode.classList[actionHandler(!isOpened)]('h-full', 'pb-10');

  addressNode.classList[actionHandler(isOpened)]('h-0', 'pb-10');
  addressNode.classList[actionHandler(!isOpened)]('h-full', 'pb-10');

  const summaryWrapper = document.querySelector('.js-summary-wrapper');
  summaryWrapper.classList[actionHandler(!isOpened)]('summary-opened');
}

function showSummary(): void {
  const { totalSub, taxIncluded, taxAmount, taxPrice, totalAmount, shippingCost, logisticSystem } = payloadData;

  document.getElementById('sub-amount').innerHTML = `฿${totalSub}`;

  if (taxIncluded) {
    const wrapper = document.querySelector('.js-tax-amount-wrapper');
    wrapper.classList.remove('hidden');
    wrapper.classList.add('inline-table');
    document.getElementById('tax-amount').innerHTML = `${Number(taxAmount)}`;
    document.getElementById('tax-price').innerHTML = `฿${Number(taxPrice).toFixed(2)}`;
  }

  if (logisticSystem) {
    document.getElementById('shipping-amount').innerHTML = `฿${shippingCost}`;
    document.getElementById('total-amount').innerHTML = `฿${Number(totalAmount + Number(taxPrice.toFixed(2)) + shippingCost).toFixed(2)}`;
  } else {
    document.getElementById('shipping-amount').innerHTML = `฿${shippingCost}`;
    document.getElementById('total-amount').innerHTML = `฿${Number(totalAmount + Number(taxPrice.toFixed(2)) + shippingCost).toFixed(2)}`;
  }
}
// eslint-disable-next-line
function saveAddress() {
  // calling prevention from paypal.js
  return;
}
// eslint-disable-next-line
function displayThankYouForm(): void {
  document.getElementById('payment-success').style.display = 'block';
}

// eslint-disable-next-line
function displayFailedForm(): void {
  document.getElementById('payment-failed').style.display = 'block';
}

// eslint-disable-next-line
function displaySubmitFormFail(): void {
  document.getElementById('submit-failed').style.display = 'block';
}

// eslint-disable-next-line
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
