import { IPipelineStep2Combined, IOmiseChargeDetail, PurchaseOrderPostbackPayload, IOmiseInitTransaction, IOmiseOrderInfo } from '@reactor-room/itopplus-model-lib';

declare const payloadData: IPipelineStep2Combined;
// eslint-disable-next-line
declare const POST: (path: string, body: PurchaseOrderPostbackPayload, callback: (params: any) => void) => void;
// declare const MessengerExtensions: any;
// eslint-disable-next-line
declare let omiseCard: any; // Paypal Buttons SDK
declare const saveAddress: () => void;
// eslint-disable-next-line
// declare const verifyOrderContext: (callback: (params: boolean) => void) => void;
// eslint-disable-next-line
declare const checkIsProductSufficient: (callback: (params: boolean) => void) => void;
declare const toggleLoader: (on: boolean) => void;
declare let setWrapperHeight: (toggle: boolean) => void;
declare let recheckOmiseResult;
declare let getUserAgent: () => string;
declare let omiseInit: boolean;
declare const EnumUserAgent: any;
declare let showToastr: (text: string, second: number, className?: string) => void;

// eslint-disable-next-line
declare const getQueryParams: any;

declare global {
  interface Window {
    Omise: any;
    OmiseCard: any;
  }
}

function checkOmiseTransaction(): void {
  const script = 'https://cdn.omise.co/omise.js.gz';
  const initOmiseScript = document.createElement('script');
  initOmiseScript.src = script;
  document.head.appendChild(initOmiseScript);
  initOmiseScript.onload = function () {
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
    omiseCard = window.OmiseCard;
    omiseCard.configure({
      publicKey: payloadData.omisePublicKey,
      submitLabel: 'Pay',
    });
    omiseInit = true;
  };
  setWrapperHeight(false);
  toggleLoader(false);
}
// eslint-disable-next-line
function closeModal(): void {
  document.getElementById('qrcode-modal').style.display = 'none';
  stopCheckResult();
}

// eslint-disable-next-line
function onConfirmOmisePromptPay(): void {
  try {
    saveAddress();
    verifyOrderContext((pass) => {
      if (pass) {
        checkIsProductSufficient((yes) => {
          if (yes) {
            toggleLoader(true);
            const action = 'PROMTPAY';
            const responseType = 'SUBMIT_OMISE_PROMTPAY_PAYMENT';
            const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
            const queryParams = getQueryParams(responseType, PSID);
            POST(
              `/purchase/omise?${queryParams}`,
              {
                audienceId: payloadData.audienceId,
                psid: payloadData.psid,
                action: action,
                type: payloadData.type,
                responseType: responseType,
              } as IOmiseInitTransaction,
              function (res) {
                (<HTMLImageElement>document.getElementById('qrcode-img')).src = res.download_uri;
                (<HTMLAnchorElement>document.getElementById('download-qrcode')).href = res.download_uri;
                document.getElementById('qrcode-modal').style.display = 'block';
                toggleLoader(false);
                checkOmiseResult();
              },
            );
          }
        });
      }
    });
  } catch (err) {
    console.error('Error ::', err);
    alert('Fail to open Omise Qrcode, please try again later or contact admin at 02-029-1200 ');
    toggleLoader(false);
  }
}

// eslint-disable-next-line
function onConfirmOmiseCreditCard(): void {
  try {
    saveAddress();
    verifyOrderContext((pass) => {
      if (pass) {
        checkIsProductSufficient((yes) => {
          if (yes) {
            toggleLoader(true);
            if (!omiseInit) {
              checkOmiseTransaction();
            }
            getOrderInfo((orderInfo: IOmiseOrderInfo) => {
              if (orderInfo) {
                omiseCard.open({
                  frameLabel: orderInfo.shopName,
                  frameDescription: payloadData.aliasOrderId,
                  amount: orderInfo.totalAmount * 100,
                  currency: 'THB',
                  defaultPaymentMethod: 'credit_card',
                  onCreateTokenSuccess: (nonce) => {
                    onCreateCreditCardTokenSuccess(nonce);
                  },
                  onFormClosed: () => {
                    toggleLoader(false);
                  },
                });
              }
            });
          }
        });
      }
    });
  } catch (err) {
    console.error('Error ::', err);
    alert('Fail to open Omise Credit card, please try again later or contact admin at 02-029-1200 ');
    toggleLoader(false);
  }
}

function onCreateCreditCardTokenSuccess(token: string): void {
  try {
    document.getElementById('pipeline-step2-container').style.display = 'none';
    document.getElementById('payment-process').style.display = 'block';
    const action = 'CREDIT_CARD';
    const responseType = 'SUBMIT_OMISE_CREDIT_CARD_PAYMENT';
    const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams(responseType, PSID);
    POST(
      `/purchase/omise?${queryParams}`,
      {
        audienceId: payloadData.audienceId,
        psid: payloadData.psid,
        action: action,
        type: payloadData.type,
        responseType: responseType,
        token: token,
      } as IOmiseInitTransaction,
      function (res: IOmiseChargeDetail) {
        console.log('res', res);
        toggleLoader(false);
        // toggle UI success or failed
        document.getElementById('payment-process').style.display = 'none';

        if (res.status === 'successful') {
          document.getElementById('payment-success').style.display = 'block';
        } else if (res.status === 'failed') {
          document.getElementById('payment-omise-failed').style.display = 'block';
          const title = <HTMLElement>document.getElementById('omise-fail-text');
          title.innerHTML = `สาเหตุ: ${res.failure_message}`;
        }
      },
    );
  } catch (err) {
    document.getElementById('payment-omise-failed').style.display = 'block';
    console.log('onCreateCreditCardTokenSuccess ===> err : ', err);
  }
}

// eslint-disable-next-line
function onConfirmOmiseInternetBanking(): void {
  try {
    saveAddress();
    verifyOrderContext((pass) => {
      if (pass) {
        checkIsProductSufficient((yes) => {
          if (yes) {
            toggleLoader(true);
            if (!omiseInit) {
              checkOmiseTransaction();
            }

            getOrderInfo((orderInfo: IOmiseOrderInfo) => {
              if (orderInfo) {
                omiseCard.open({
                  frameLabel: orderInfo.shopName,
                  frameDescription: payloadData.aliasOrderId,
                  amount: orderInfo.totalAmount * 100,
                  currency: 'THB',
                  defaultPaymentMethod: 'internet_banking',
                  onCreateTokenSuccess: (nonce) => {
                    onCreateInternetBankingSourceSuccess(nonce);
                  },
                  onFormClosed: () => {
                    toggleLoader(false);
                  },
                });
              }
            });
          }
        });
      }
    });
  } catch (err) {
    console.error('Error ::', err);
    alert('Fail to open Omise Credit card, please try again later or contact admin at 02-029-1200 ');
    toggleLoader(false);
  }
}

function onCreateInternetBankingSourceSuccess(source: string): void {
  try {
    document.getElementById('pipeline-step2-container').style.display = 'none';
    const action = 'INTERNET_BANKING';
    const responseType = 'SUBMIT_OMISE_INTERNET_BANKING';
    const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams(responseType, PSID);
    POST(
      `/purchase/omise?${queryParams}`,
      {
        audienceId: payloadData.audienceId,
        psid: payloadData.psid,
        action: action,
        type: payloadData.type,
        responseType: responseType,
        source: source,
      } as IOmiseInitTransaction,
      function (authUrl) {
        const userAgent = getUserAgent();
        if (userAgent === EnumUserAgent.WINDOWS || userAgent === EnumUserAgent.LINUX || userAgent === EnumUserAgent.UNIX || userAgent === EnumUserAgent.MACOS) {
          window.open(authUrl, '_blank');
        } else {
          window.open(authUrl, '_parent');
        }
        document.getElementById('pipeline-step2-container').style.display = 'none';
        document.getElementById('payment-process').style.display = 'block';
        recheckOmiseResult = setInterval(checkOmiseResult, 3000);
        setTimeout(() => {
          stopCheckResult();
        }, 12000);
      },
    );
  } catch (err) {
    console.log('onCreateInternetBankingSourceSuccess ===> err : ', err);
    document.getElementById('payment-omise-failed').style.display = 'block';
  }
}

function checkOmiseResult(): void {
  try {
    const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams('INTERVAL_CHECK_PURCHASE_ORDER_STATUS', PSID);
    POST(`/purchase/postback?${queryParams}`, null, function (res) {
      if (res === 'PENDING') {
        recheckOmiseResult = setInterval(reCheckOmiseResult, 3000);
        setTimeout(() => {
          stopCheckResult();
        }, 12000);
      }

      if (res === 'SUCCESS') {
        stopCheckResult();
        if (document.getElementById('qrcode-modal')) {
          this.closeModal();
        }
        document.getElementById('pipeline-step2-container').style.display = 'none';
        if (document.getElementById('payment-process')) {
          document.getElementById('payment-process').style.display = 'none';
        }
        document.getElementById('payment-success').style.display = 'block';
      } else if (res === 'FAILED') {
        showToastr('การดำเนินการชำระเงินล้มเหลว', 6, 'alert');
        document.getElementById('payment-process').style.display = 'none';
        if (document.getElementById('qrcode-modal')) {
          this.closeModal();
          document.getElementById('pipeline-step2-container').style.display = 'none';
          document.getElementById('payment-omise-failed').style.display = 'block';
        } else {
          document.getElementById('payment-omise-failed').style.display = 'block';
          stopCheckResult();
        }
      }
    });
  } catch (err) {
    console.error('Error ::', err);
    document.getElementById('payment-omise-failed').style.display = 'block';
  }
}

function reCheckOmiseResult(): void {
  try {
    const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams('CHECK_PURCHASE_ORDER_STATUS', PSID);
    POST(`/purchase/postback?${queryParams}`, null, function (res) {
      if (res === 'SUCCESS') {
        stopCheckResult();
        if (document.getElementById('qrcode-modal')) {
          this.closeModal();
        }
        document.getElementById('pipeline-step2-container').style.display = 'none';
        if (document.getElementById('payment-process')) {
          document.getElementById('payment-process').style.display = 'none';
        }
        document.getElementById('payment-success').style.display = 'block';
      } else if (res === 'FAILED') {
        showToastr('การดำเนินการชำระเงินล้มเหลว', 6, 'alert');
        document.getElementById('payment-process').style.display = 'none';
        if (document.getElementById('qrcode-modal')) {
          this.closeModal();
          document.getElementById('pipeline-step2-container').style.display = 'none';
          document.getElementById('payment-omise-failed').style.display = 'block';
        } else {
          document.getElementById('payment-omise-failed').style.display = 'block';
          stopCheckResult();
        }
      }
    });
  } catch (err) {
    console.error('Error ::', err);
    document.getElementById('payment-omise-failed').style.display = 'block';
  }
}

function stopCheckResult() {
  clearInterval(recheckOmiseResult);
}

function getOrderInfo(cb: any): void {
  const psid = (<HTMLInputElement>document.getElementById('psid')).value;
  const queryParams = getQueryParams('GET_OMISE_ORDER_INFO', psid);

  POST(`/purchase/postback?${queryParams}`, null, function (result) {
    if (result) {
      cb(result);
    } else {
      cb(false);
    }
  });
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
