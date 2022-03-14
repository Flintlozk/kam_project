import { IPipelineStep2Combined, PurchaseOrderPostbackPayload } from '@reactor-room/itopplus-model-lib';

declare let payloadData: IPipelineStep2Combined;
// eslint-disable-next-line
declare const POST: (path: string, body: PurchaseOrderPostbackPayload, callback: (params: any) => void) => void;
// eslint-disable-next-line
declare let omiseInit: boolean;
// eslint-disable-next-line
declare let enableConfirm: boolean;
// eslint-disable-next-line
declare let recheckOmiseResult;
// eslint-disable-next-line
declare const MessengerExtensions: any;
// eslint-disable-next-line
declare const getQueryParams: any;
// eslint-disable-next-line
declare const checkOmiseTransaction: any;

window.onload = function (): void {
  // Update here
  const omiseGroup = document.getElementById('omise-group');
  if (omiseGroup) {
    omiseGroup.style.display = 'block';

    if (payloadData.omiseOption.creditCard) {
      const omiseCCButton = document.getElementById('omise-cc-button');
      omiseCCButton.style.display = 'block';
    }

    if (payloadData.omiseOption.qrCode) {
      const omiseQr = document.getElementById('omise-qr-button');
      omiseQr.style.display = 'block';
    }
  }
  toggleLoader(true);
  checkOmiseTransaction();
  showSummary();
  toggleSummaryDetails();
  hideConfirmButton();
};
// eslint-disable-next-line
function toggleLoader(bool: boolean): void {
  document.getElementById('loader').style.display = bool ? 'flex' : 'none';
}

function hideConfirmButton(): void {
  const button = <HTMLButtonElement>document.getElementById('step2-confirm-button');
  button.style.display = 'none';
  // setWrapperHeight(false);
}

// eslint-disable-next-line
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
function setWrapperHeight(toggle: boolean) {
  const container = <HTMLElement>document.querySelector('.wrapper');
  if (toggle) {
    container.classList.remove('wrapper-ex');
  } else {
    container.classList.add('wrapper-ex');
  }
}

function stopCheckResult() {
  if (recheckOmiseResult) clearInterval(recheckOmiseResult);
}
// eslint-disable-next-line
function checkOmiseResult(): void {
  try {
    const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams('INTERVAL_CHECK_PURCHASE_ORDER_STATUS', PSID);
    POST(`/purchase/postback?${queryParams}`, null, function (res) {
      if (res !== 'PENDING') {
        document.getElementById('payment-success').style.display = 'block';
        document.getElementById('pipeline-step2-container').style.display = 'none';
      } else {
        recheckOmiseResult();
      }
    });
  } catch (err) {
    console.error('Error ::', err);
  }
}
// eslint-disable-next-line
function reCheckOmiseResult(): void {
  try {
    const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams('CHECK_PURCHASE_ORDER_STATUS', PSID);
    POST(`/purchase/postback?${queryParams}`, null, function (res) {
      if (res) {
        stopCheckResult();
        document.getElementById('payment-success').style.display = 'block';
        document.getElementById('pipeline-step2-container').style.display = 'none';
      }
    });
  } catch (err) {
    console.error('Error ::', err);
  }
}
// eslint-disable-next-line
function closeModal(): void {
  stopCheckResult();
  document.getElementById('qrcode-modal').style.display = 'none';
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
