import { IPipelineStep2Combined, PurchaseOrderPostbackPayload } from '@reactor-room/itopplus-model-lib';

declare let payloadData: IPipelineStep2Combined;
// eslint-disable-next-line
declare let enableConfirm: boolean;
// eslint-disable-next-line
declare let showToastr: (text: string, second: number, className?: string) => void;
// eslint-disable-next-line
declare const getQueryParams: any;
// eslint-disable-next-line
declare const POST: (path: string, body: PurchaseOrderPostbackPayload, callback: (params: any) => void) => void;
// eslint-disable-next-line
declare const MessengerExtensions: any;
// eslint-disable-next-line
// declare const verifyOrderContext: (callback: (params: boolean) => void) => void;
// eslint-disable-next-line
declare const checkIsProductSufficient: (callback: (params: boolean) => void) => void;

window.onload = function (): void {
  const button = <HTMLButtonElement>document.getElementById('step2-confirm-button');
  const title = <HTMLElement>document.getElementById('step2-confirm-button-title');
  title.innerHTML = 'ชำระเงินด้วยบัตรเครดิต / เดบิต';
  //   toggleLoader(true);
  showSummary();
  toggleSummaryDetails();

  button.removeAttribute('disabled');
  button.classList.remove('confirm-disable');
  button.addEventListener('click', () => {
    verifyOrderContext((pass) => {
      if (pass) {
        checkIsProductSufficient((yes) => {
          if (yes) {
            onConfirm2C2P();
          }
        });
      }
    });
  });
};
// eslint-disable-next-line
function toggleLoader(bool: boolean): void {
  document.getElementById('loader').style.display = bool ? 'flex' : 'none';
}
// eslint-disable-next-line
function hideConfirmButton(): void {
  const button = <HTMLButtonElement>document.getElementById('step2-confirm-button');
  button.style.display = 'none';
  // setWrapperHeight(false);
}

// eslint-disable-next-line
function disableConfirmButton(): void {
  enableConfirm = false;
  const button = <HTMLButtonElement>document.getElementById('step2-confirm-button');
  if (button) {
    button.setAttribute('disabled', 'disabled');
    button.classList.add('confirm-disable');
  }
}

function verifyOrderContext(callback: (param: boolean) => void): void {
  try {
    toggleLoader(true);
    const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams('VERIFY_ORDER_CONTEXT', PSID);

    POST(`/purchase/postback?${queryParams}`, null, function (isPass: boolean) {
      if (isPass) {
        toggleLoader(false);
        callback(true);
      } else {
        showToastr('มีข้อมูลถูกอัพเดต กรุณาตรวจสอบข้อมูลการสั่งซื้ออีกครั้ง', 3, 'alert');
        // callback(false);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    });
  } catch (err) {
    // alert(err.message);
    showToastr('มีข้อมูลถูกอัพเดต กรุณาตรวจสอบข้อมูลการสั่งซื้ออีกครั้ง', 3, 'alert');
    setTimeout(() => {
      window.location.reload();
    }, 3000);
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

function onConfirm2C2P(): void {
  try {
    const action = 'PAYMENT';
    const responseType = 'SUBMIT_2C2P_PAYMENT';

    const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams(responseType, PSID);

    POST(
      `/purchase/2c2p?${queryParams}`,
      {
        audienceId: payloadData.audienceId,
        psid: payloadData.psid,
        action: action,
        type: payloadData.type,
      },
      function (res) {
        (<HTMLInputElement>document.getElementById('version')).value = res.version;
        (<HTMLInputElement>document.getElementById('merchant_id')).value = res.merchantID;
        (<HTMLInputElement>document.getElementById('payment_description')).value = res.payment_description;
        (<HTMLInputElement>document.getElementById('order_id')).value = res.order_id;
        (<HTMLInputElement>document.getElementById('currency')).value = res.currency;
        (<HTMLInputElement>document.getElementById('amount')).value = res.amount;
        (<HTMLInputElement>document.getElementById('result_url_1')).value = res.result_url_1;
        (<HTMLInputElement>document.getElementById('result_url_2')).value = res.result_url_2;
        (<HTMLInputElement>document.getElementById('request_3ds')).value = res.request_3ds;
        (<HTMLInputElement>document.getElementById('payment_option')).value = res.payment_option;
        (<HTMLInputElement>document.getElementById('hash_value')).value = res.hash_value;
        (<HTMLFormElement>document.getElementById('myform')).submit();
      },
    );
  } catch (err) {
    console.error('Error ::', err);
  }
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
