import { IPipelineStep2Combined, IPurchaseOrderPostbackSelectPayment, PurchaseOrderPostbackPayload } from '@reactor-room/itopplus-model-lib';

declare const payloadData: IPipelineStep2Combined;
// eslint-disable-next-line
declare const POST: (path: string, body: PurchaseOrderPostbackPayload, callback: (params: any) => void) => void;
declare let paypalInit: boolean;
declare let omiseInit: boolean;
declare const initPaypalScript: HTMLElement;
declare const toggleLoader;
declare let showConfirmButton: () => void;
declare let disableConfirmButton: () => void;
declare let hideConfirmButton: () => void;
declare let enableConfirmButton: (type: string) => void;
declare let showToastr: (text: string, second: number, className?: string) => void;
declare let setWrapperHeight: (toggle: boolean) => void;
declare let checkOmiseTransaction: () => void;
declare const MessengerExtensions: any;
// eslint-disable-next-line
declare const getQueryParams: any;
// eslint-disable-next-line
declare const verifyOrderContext: (callback: (params: boolean) => void) => void;
// eslint-disable-next-line
declare const checkIsProductSufficient: (callback: (params: boolean) => void) => void;

declare global {
  interface Window {
    Omise: any;
    OmiseCard: any;
  }
}

function checkPaypalTransaction(): void {
  verifyOrderContext((pass) => {
    if (pass) {
      checkIsProductSufficient((yes) => {
        toggleLoader(false);
        if (yes) {
          paypalInit = true;
          setWrapperHeight(false);
          disableConfirmButton();
          hideConfirmButton();
          toggleLoader(false);
          document.head.appendChild(initPaypalScript);
        }
      });
    }
  });
}

// eslint-disable-next-line
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

// eslint-disable-next-line
function onCopyAccount(elementId: string): void {
  const str = document.getElementById('accountid' + elementId).innerText;
  const el = document.createElement('textarea');
  // const displayStr = str;
  el.value = str.replace(/-/g, '');
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  // document.getElementById('dAccNumber').innerText = displayStr;
  // const copied = document.getElementById('copied');
  // copied.style.display = 'flex';
  showToastr('คัดลอกเลขที่บัญชีแล้ว !', 3);
}

// eslint-disable-next-line
function selectPaymentMethod(action: string, id: string, paymentID: number): void {
  payloadData.paymentID = Number(paymentID);
  disableConfirmButton();
  toggleLoader(true);
  document.querySelector('.js-summary-confirm').removeAttribute('disabled');
  (<HTMLInputElement>document.getElementById(id)).checked = true;

  const bankGroup = document.getElementById('bank-group');
  if (action !== 'BANK_ACCOUNT' && bankGroup !== undefined && bankGroup !== null) bankGroup.style.display = 'none';

  const body = {
    paymentType: action,
  } as IPurchaseOrderPostbackSelectPayment;
  const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
  const queryParams = getQueryParams('SELECT_PAYMENT_METHOD', PSID);
  POST(`/purchase/postback?${queryParams}`, body, function (isPass: boolean) {
    if (isPass) {
      onPassSelectPayment(action, bankGroup);
    } else onFailSelectPayment();
  });
}

function onPassSelectPayment(action: string, bankGroup: HTMLElement): void {
  const paypalGroupNode = document.getElementById('paypal-group');
  const omiseGroupNode = document.getElementById('omise-group');
  switch (action) {
    case 'BANK_ACCOUNT': {
      toggleLoader(false);
      setWrapperHeight(true);
      bankGroup.style.display = 'flex';
      window.scrollTo(0, document.body.scrollHeight);
      enableConfirmButton('BANK_ACCOUNT');
      if (paypalGroupNode) paypalGroupNode.style.display = 'none';
      if (omiseGroupNode) omiseGroupNode.style.display = 'none';
      setTimeout(() => {
        // delay view
        showConfirmButton();
      }, 100);
      break;
    }
    case 'CASH_ON_DELIVERY': {
      setWrapperHeight(true);
      enableConfirmButton('');
      if (paypalGroupNode) paypalGroupNode.style.display = 'none';
      if (omiseGroupNode) omiseGroupNode.style.display = 'none';
      setTimeout(() => {
        // delay view
        showConfirmButton();
      }, 100);
      toggleLoader(false);
      break;
    }
    case 'PAYPAL': {
      if (paypalGroupNode) paypalGroupNode.style.display = 'block';
      if (omiseGroupNode) omiseGroupNode.style.display = 'none';
      if (!paypalInit) {
        setWrapperHeight(false);
        checkPaypalTransaction();
      } else {
        disableConfirmButton();
        hideConfirmButton();
        toggleLoader(false);
      }
      break;
    }
    case 'PAYMENT_2C2P': {
      setWrapperHeight(true);
      if (paypalGroupNode) paypalGroupNode.style.display = 'none';
      if (omiseGroupNode) omiseGroupNode.style.display = 'none';
      toggleLoader(false);
      enableConfirmButton('PAYMENT_2C2P');
      setTimeout(() => {
        // delay view
        showConfirmButton();
      }, 100);
      break;
    }
    case 'OMISE': {
      setWrapperHeight(true);
      if (omiseGroupNode) omiseGroupNode.style.display = 'block';
      if (paypalGroupNode) paypalGroupNode.style.display = 'none';
      if (!omiseInit) {
        setWrapperHeight(false);
        checkOmiseTransaction();
      }
      disableConfirmButton();
      hideConfirmButton();
      toggleLoader(false);

      break;
    }
    default: {
      alert('SOMETHING WENT WRONG : PAYMENT NOT FOUND');
      break;
    }
  }
}

function onFailSelectPayment(): void {
  toggleLoader(false);
  const bank = document.getElementById('bank-group');
  if (bank) bank.style.display = 'none';

  const paypalGroupNode = document.getElementById('paypal-group');
  if (paypalGroupNode) paypalGroupNode.style.display = 'none';
  const omiseGroupNode = document.getElementById('omise-group');
  if (omiseGroupNode) omiseGroupNode.style.display = 'none';
}
