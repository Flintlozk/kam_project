import { IPipelineStep2Combined, IPipelineStep2SettingProductList, IPurchaseOrderPostbackMessageAddress, PurchaseOrderPostbackPayload } from '@reactor-room/itopplus-model-lib';

declare let payloadData: IPipelineStep2Combined;
declare let nextFunc: nextDoFunction;
declare const paypalInit: boolean;
declare const omiseInit: boolean;
// eslint-disable-next-line
declare const checkPaypalTransaction: any;
// eslint-disable-next-line
declare const checkOmiseTransaction: any;
// eslint-disable-next-line
declare const MessengerExtensions: any;
// eslint-disable-next-line
declare const POST: (path: string, body: PurchaseOrderPostbackPayload, callback: (params: any) => void) => void;
// eslint-disable-next-line
declare const bindEventListenerToAddressForm: any;
// eslint-disable-next-line
declare const getQueryParams: any;
declare let showToastr: (text: string, second: number, className?: string) => void;

declare let enableConfirm: boolean;
// eslint-disable-next-line
declare const onConfirm2C2P: () => void;

function enableConfirmButton(type: string): void {
  enableConfirm = true;
  const button = <HTMLButtonElement>document.getElementById('step2-confirm-button');
  const title = <HTMLElement>document.getElementById('step2-confirm-button-title');
  if (type === 'PAYMENT_2C2P') {
    nextFunc = nextDoFunction.PAYMENT_2C2P;
    title.innerHTML = 'ชำระเงินด้วยบัตรเครดิต / เดบิต';
  } else {
    nextFunc = nextDoFunction.CONFIRM;
    title.innerHTML = 'Confirm';
  }
  button.removeAttribute('disabled');
  button.classList.remove('confirm-disable');
}

// eslint-disable-next-line
function showConfirmButton(): void {
  const button = <HTMLButtonElement>document.getElementById('step2-confirm-button');
  button.style.display = 'flex';
  setWrapperHeight(true);
}
function hideConfirmButton(): void {
  const button = <HTMLButtonElement>document.getElementById('step2-confirm-button');
  button.style.display = 'none';
  setWrapperHeight(false);
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

function disableConfirmButton(): void {
  enableConfirm = false;
  const button = <HTMLButtonElement>document.getElementById('step2-confirm-button');
  if (button) {
    button.setAttribute('disabled', 'disabled');
    button.classList.add('confirm-disable');
  }
}

function showPaymentStep(): void {
  const elem = document.getElementById('payment');
  if (elem) elem.style.display = 'flex';
}
function showCodOption(): void {
  const elem = document.getElementById('COD_OPTION');
  if (elem) elem.style.display = 'flex';
}
function hideCodOption(): void {
  const elem = document.getElementById('COD_OPTION');
  if (elem) elem.style.display = 'none';
}

function showShipping(): void {
  const wrapper = document.querySelector('.js-shipping-wrapper');
  wrapper.classList.remove('hidden');
  wrapper.classList.add('inline-table');
}

window.onload = function (): void {
  bindEventListenerToAddressForm();
  showSummary();
  if (payloadData.logisticSystem) {
    showPaymentStep();
    showCodOption();

    checkPaymentEnabled();
  } else if (payloadData.logisticID !== null) {
    const logistic = payloadData.logistics.find((item) => item.id === payloadData.logisticID);
    if (logistic) {
      if (logistic.isCOD) showCodOption();
      else hideCodOption();
      showPaymentStep();

      checkPaymentEnabled();
    }
  }

  // setInterval(() => {
  //   getProductInCart((products: IPipelineStep2SettingProductList[]) => {
  //     payloadData.productList = products;
  //   });
  // }, 10000);
};

// function refreshProductList(): void {
//   getProductInCart((products: IPipelineStep2SettingProductList[]) => {
//     payloadData.productList = products;
//   });
// }

// eslint-disable-next-line
function getProductInCart(callback: (param: IPipelineStep2SettingProductList[]) => void): void {
  try {
    const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams('GET_PRODUCT_IN_CART', PSID);
    POST(`/purchase/postback?${queryParams}`, null, function (products: IPipelineStep2SettingProductList[]) {
      callback(products);
    });
  } catch (err) {
    alert(err.message);
  }
}
// // eslint-disable-next-line
// function reloadOrderContext(callback: (param: IPipelineStep2SettingProductList[]) => void): void {
//   try {
//     const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
//     const queryParams = getQueryParams('RELOAD_CART_CONTEXT', PSID);
//     POST(`/purchase/postback?${queryParams}`, null, function (products: IPipelineStep2SettingProductList[]) {
//       callback(products);
//     });
//   } catch (err) {
//     alert(err.message);
//   }
// }

function checkPaymentEnabled(): void {
  if (payloadData.paymentID !== null) {
    const payment = payloadData.payments.find((item) => item.id === payloadData.paymentID);
    if (payment) {
      const paypalGroup = document.getElementById('paypal-group');
      const omiseGroup = document.getElementById('omise-group');
      switch (payment.type) {
        case 'BANK_ACCOUNT': {
          setWrapperHeight(true);
          const bankGroup = document.getElementById('bank-group');
          bankGroup.style.display = 'flex';
          enableConfirmButton('BANK_ACCOUNT');
          break;
        }
        case 'CASH_ON_DELIVERY': {
          setWrapperHeight(true);
          enableConfirmButton('CASH_ON_DELIVERY');
          break;
        }
        case 'PAYPAL': {
          setWrapperHeight(false);
          hideConfirmButton();
          disableConfirmButton();
          if (paypalGroup) paypalGroup.style.display = 'block';
          toggleLoader(true);
          if (!paypalInit) checkPaypalTransaction();
          break;
        }
        case 'PAYMENT_2C2P': {
          setWrapperHeight(true);
          enableConfirmButton('PAYMENT_2C2P');
          break;
        }
        case 'OMISE': {
          setWrapperHeight(false);
          hideConfirmButton();
          disableConfirmButton();
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
          if (!omiseInit) checkOmiseTransaction();
          break;
        }
        default: {
          if (paypalGroup) paypalGroup.style.display = 'none';
          if (omiseGroup) paypalGroup.style.display = 'none';
          disableConfirmButton();
          break;
        }
      }
    }
  }
}

function toggleLoader(bool: boolean): void {
  document.getElementById('loader').style.display = bool ? 'flex' : 'none';
}

function showSummary(): void {
  const { totalSub, taxIncluded, taxAmount, taxPrice, totalAmount, logisticID, shippingCost, logisticSystem } = payloadData;

  document.getElementById('sub-amount').innerHTML = `฿${totalSub}`;

  if (taxIncluded) {
    const wrapper = document.querySelector('.js-tax-amount-wrapper');
    wrapper.classList.remove('hidden');
    wrapper.classList.add('inline-table');
    document.getElementById('tax-amount').innerHTML = `${Number(taxAmount).toFixed(2)}`;
    document.getElementById('tax-price').innerHTML = `฿${Number(taxPrice).toFixed(2)}`;
  }

  if (logisticSystem) {
    showShipping();
    document.getElementById('shipping-amount').innerHTML = `฿${shippingCost}`;
    document.getElementById('total-amount').innerHTML = `฿${Number(totalAmount + Number(taxPrice.toFixed(2)) + shippingCost).toFixed(2)}`;
  } else if (logisticID !== null) {
    showShipping();
    document.getElementById('shipping-amount').innerHTML = `฿${shippingCost}`;
    document.getElementById('total-amount').innerHTML = `฿${Number(totalAmount + Number(taxPrice.toFixed(2)) + shippingCost).toFixed(2)}`;
  } else {
    document.getElementById('total-amount').innerHTML = `฿${Number(totalAmount + Number(taxPrice.toFixed(2))).toFixed(2)}`;
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
function checkIsProductSufficient(callback: (param: boolean) => void): void {
  try {
    toggleLoader(true);
    const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams('CHECK_PRODUCT_SUFFICIENT', PSID);

    POST(`/purchase/postback?${queryParams}`, null, function (isPass: boolean) {
      if (isPass) {
        callback(true);
      } else {
        showToastr('ขออภัย.. สินค้าที่ท่านต้องการไม่เพียงพอ', 6, 'alert');
        toggleLoader(false);
        callback(false);
      }
    });
  } catch (err) {
    alert(err.message);
    toggleLoader(false);
  }
}

// eslint-disable-next-line
function confirmStep(): void {
  try {
    if (enableConfirm) {
      const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
      const queryParams = getQueryParams('CONFIRM_PAYMENT_SELECTION', PSID);

      POST(`/purchase/postback?${queryParams}`, null, function (isPass: boolean) {
        toggleLoader(false);
        if (isPass) {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          displayThankYouForm();
        } else {
          displaySubmitFormFail();
        }
      });
    }
  } catch (err) {
    alert(err.message);
    toggleLoader(false);
  }
}

function displayThankYouForm(): void {
  const payment = payloadData.payments.find((item) => item.id === payloadData.paymentID);
  closeTab(payment.type);
}

// eslint-disable-next-line
function displayFailedForm(): void {
  document.getElementById('pipeline-step2-container').style.display = 'none';
  document.getElementById('payment-failed').style.display = 'block';
}
function displaySubmitFormFail(): void {
  document.getElementById('pipeline-step2-container').style.display = 'none';
  document.getElementById('submit-failed').style.display = 'block';
}

function closeTab(type: string) {
  document.getElementById('pipeline-step2-container').style.display = 'none';

  if (type === 'BANK_ACCOUNT') document.getElementById('payment-pending-bank').style.display = 'block';
  else if (type === 'CASH_ON_DELIVERY') document.getElementById('payment-pending-cod').style.display = 'block';
  else document.getElementById('payment-success').style.display = 'block';

  setTimeout(() => {
    if (typeof MessengerExtensions !== 'function') {
      window.close();
    } else {
      MessengerExtensions.requestCloseBrowser(function () {
        //
      });
    }
  }, 3000);
}

// eslint-disable-next-line
enum nextDoFunction {
  CONFIRM = 'CONFIRM',
  OMISE = 'OMISE',
  PAYMENT_2C2P = 'PAYMENT_2C2P',
  PAYPAL = 'PAYPAL',
}

// eslint-disable-next-line
function saveAddress(): void {
  try {
    toggleLoader(true);
    const address = {} as IPurchaseOrderPostbackMessageAddress;
    const inputFields = ['name', 'phone_number', 'address', 'post_code', 'district', 'city', 'province'];
    inputFields.forEach((id) => {
      const { value } = <HTMLTextAreaElement | HTMLInputElement>document.getElementById(id);

      if (id === 'post_code') {
        if (value.length !== 5) {
          showToastr('กรุณากรอกหมายเลขหมายเลขรหัสไปรษณีย์ให้ถูกต้อง', 6, 'alert');
          throw new Error(`Fieldname[ ${id} ] is incorrect format.`);
        }
      }

      if (id === 'phone_number') {
        const result = addPhoneNumberValidation(value);
        if (!result.ok) {
          showToastr(result.message, 6, 'alert');
          throw new Error(`Fieldname[ ${id} ] is incorrect format.`);
        }
      }
      if (value === '' || value === null || value === undefined) {
        showToastr('กรุณาตรวจสอบข้อมูลการจัดส่งอีกครั้ง', 6, 'alert');
        throw new Error(`Missing delivery address, Fieldname[ ${id} ]`);
      }
      address[id] = value;
    });
    const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams('UPDATE_DELIVERY_ADDRESS', PSID);

    POST(`/purchase/postback?${queryParams}`, address, function (isPass: boolean) {
      if (isPass) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        switch (nextFunc) {
          case nextDoFunction.CONFIRM: {
            verifyOrderContext((pass) => {
              if (pass) {
                checkIsProductSufficient((yes) => {
                  if (yes) {
                    confirmStep();
                  }
                });
              }
            });
            break;
          }
          case nextDoFunction.OMISE: {
            toggleLoader(false);
            break;
          }
          case nextDoFunction.PAYMENT_2C2P: {
            verifyOrderContext((pass) => {
              if (pass) {
                checkIsProductSufficient((yes) => {
                  if (yes) {
                    onConfirm2C2P();
                    toggleLoader(false);
                  }
                });
              }
            });
            break;
          }
          case nextDoFunction.PAYPAL: {
            toggleLoader(false);
            // SDK Already handle this case
            break;
          }
          default:
            break;
        }
      } else {
        // TODO : handle error
      }
    });
  } catch (err) {
    toggleLoader(false);
  }
}

function addPhoneNumberValidation(value): { ok: boolean; message: string } {
  const regExp = new RegExp('^[0-9]+$');
  if ((value !== null && value.length >= 9) || !regExp.test(value)) {
    const firstDigit = value.substring(0, 1);
    const infrontNumber = value.substring(0, 2);
    const isHomeNumber = infrontNumber === '02' || infrontNumber === '03' || infrontNumber === '04' || infrontNumber === '05' || infrontNumber === '07';
    const checkLength = value.replace(/[^0-9]/g, '').length;
    if (isHomeNumber) {
      if (checkLength === 9) {
        return {
          ok: true,
          message: '',
        };
      } else {
        return {
          ok: false,
          message: 'กรุณากรอกหมายเลขติดต่อ 9 หลัก',
        };
      }
    } else {
      if (checkLength === 10 && +firstDigit === 0) {
        return {
          ok: true,
          message: '',
        };
      } else {
        return {
          ok: false,
          message: 'กรุณากรอกหมายเลขติดต่อ 10 หลัก',
        };
      }
    }
  } else {
    return {
      ok: false,
      message: 'กรุณากรอกหมายเลขติดต่อ 9 - 10 หลัก',
    };
  }
}

// eslint-disable-next-line
function singleSaveAddress(): void {
  try {
    toggleLoader(true);
    const address = {} as IPurchaseOrderPostbackMessageAddress;
    const inputFields = ['name', 'phone_number', 'address', 'post_code', 'district', 'city', 'province'];
    inputFields.forEach((id) => {
      const { value } = <HTMLTextAreaElement | HTMLInputElement>document.getElementById(id);

      if (id === 'post_code') {
        if (value.length !== 5) {
          showToastr('กรุณากรอกหมายเลขหมายเลขรหัสไปรษณีย์ให้ถูกต้อง', 6, 'alert');
          throw new Error(`Fieldname[ ${id} ] is incorrect format.`);
        }
      }

      if (id === 'phone_number') {
        const result = addPhoneNumberValidation(value);
        if (!result.ok) {
          showToastr(result.message, 6, 'alert');
          throw new Error(`Fieldname[ ${id} ] is incorrect format.`);
        }
      }
      if (value === '' || value === null || value === undefined) {
        showToastr('กรุณาตรวจสอบข้อมูลการจัดส่งอีกครั้ง', 6, 'alert');
        throw new Error(`Missing delivery address, Fieldname[ ${id} ]`);
      }
      address[id] = value;
    });
    const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams('UPDATE_DELIVERY_ADDRESS', PSID);

    POST(`/purchase/postback?${queryParams}`, address, function (isPass: boolean) {
      if (isPass) {
        // ok
      } else {
        // TODO : handle error
      }
    });
  } catch (err) {
    toggleLoader(false);
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
