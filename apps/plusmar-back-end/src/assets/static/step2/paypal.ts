import { IPipelineStep2Combined, PurchaseOrderPostbackPayload, IPipelinePaypalApproveData } from '@reactor-room/itopplus-model-lib';

declare const payloadData: IPipelineStep2Combined;
// eslint-disable-next-line
declare const POST: (path: string, body: PurchaseOrderPostbackPayload, callback: (params: any) => void) => void;
// declare const MessengerExtensions: any;
// eslint-disable-next-line
declare const paypal: any; // Paypal Buttons SDK
declare const saveAddress: () => void;
declare const toggleLoader: (on: boolean) => void;
declare const displayThankYouForm: () => void;
declare const displayFailedForm: () => void;
declare const displaySubmitFormFail: () => void;
// eslint-disable-next-line
declare let showToastr: (text: string, second: number, className?: string) => void;
// eslint-disable-next-line
declare const getQueryParams: any;
// eslint-disable-next-line
declare let nextFunc: nextDoFunction;
enum nextDoFunction {
  PAYPAL = 'PAYPAL',
}

function onApproveHandler(data: IPipelinePaypalApproveData) {
  try {
    toggleLoader(true);
    const psid = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams('SUBMIT_PAYPAL_PAYMENT_APPROVE', psid);
    const body = { ...data } as IPipelinePaypalApproveData;
    POST(`/purchase/postback?${queryParams}`, body, function (isPass) {
      toggleLoader(false);
      if (isPass) {
        displayThankYouForm();
      } else {
        displayFailedForm();
      }
    });
  } catch (err) {
    console.error('Error ::', err);
  }
}

function onErrorHandler(err: any): void {
  const response_type = 'SUBMIT_PAYPAL_PAYMENT_ERROR';
  const status = 'ON_ERROR';

  try {
    const psid = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams(response_type, psid);
    const body = {
      audienceId: payloadData.audienceId,
      psid: payloadData.psid,
      type: response_type,
      status,
    };
    POST(`/purchase/postback?${queryParams}`, body, function () {
      toggleLoader(false);
      displaySubmitFormFail();
      //
    });
  } catch (err) {
    console.error('Error ::', err);
  }
}

function onCancelHandler(): void {
  toggleLoader(false);
  const response_type = 'SUBMIT_PAYPAL_PAYMENT_CANCEL';
  const status = 'ON_CANCEL';

  try {
    const psid = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams(response_type, psid);
    const object = {
      audienceId: payloadData.audienceId,
      psid: payloadData.psid,
      type: response_type,
      status,
    };
    POST(`/purchase/postback?${queryParams}`, object, function () {
      // do nothing
    });
  } catch (err) {
    console.error('Error ::', err);
  }
}

function getPaypalInfo(cb: any): void {
  const psid = (<HTMLInputElement>document.getElementById('psid')).value;
  const queryParams = getQueryParams('PAYMENT_PAYPAL', psid);
  const body = { audienceId: payloadData.audienceId, psid: payloadData.psid, type: 'GET_PAYPAL_INFO' };
  POST(`/purchase/paypal?${queryParams}`, body, function (result) {
    if (result) {
      cb(result);
    } else {
      cb(false);
    }
  });
}

const script = `https://www.paypal.com/sdk/js?currency=${payloadData.currency}&client-id=${payloadData.paypalClientId}&disable-funding=card,credit`;

const initPaypalScript = document.createElement('script');

initPaypalScript.src = script;
initPaypalScript.onload = function () {
  if (paypal) {
    getPaypalInfo((paypalObject) => {
      paypal
        .Buttons({
          style: {
            layout: 'vertical',
            shape: 'pill',
            size: '25px',
          },
          createOrder: function (data, actions) {
            saveAddress();
            const purchaseUnits = {
              purchase_units: [{ custom_id: payloadData.customId, ...paypalObject }],
            };
            return actions.order.create(purchaseUnits);
          },
          onClick: function (data, actions) {
            // eslint-disable-next-line
            nextFunc = nextDoFunction.PAYPAL;
            toggleLoader(true);
          },
          onApprove: function (data, actions) {
            onApproveHandler(data);
          },
          onCancel: function () {
            onCancelHandler();
          },
          onError: function (err) {
            onErrorHandler(err);
          },
        })
        .render('#paypal-button');
    });
  }
};
