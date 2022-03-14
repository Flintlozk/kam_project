import { IPipelineStep2Combined, IPurchaseOrderPostbackSelectLogistic, PurchaseOrderPostbackPayload } from '@reactor-room/itopplus-model-lib';
declare const payloadData: IPipelineStep2Combined;
// eslint-disable-next-line
declare const POST: (path: string, body: PurchaseOrderPostbackPayload, callback: (params: any) => void) => void;
// eslint-disable-next-line
declare const getQueryParams: any;
// eslint-disable-next-line
declare const toggleLoader: any;
// eslint-disable-next-line
declare const disableConfirmButton: any;
// eslint-disable-next-line
declare let cod: boolean;
declare const showShipping: () => void;
declare const showPaymentStep: () => void;
declare const showCodOption: () => void;
declare const hideCodOption: () => void;

// eslint-disable-next-line
function selectLogisticMethod(logisticID: number, isFlatRate: boolean, logisticFee: string, isCOD: boolean, hashKey: string): void {
  const { totalAmount, taxIncluded, taxPrice } = payloadData;
  showShipping();
  toggleLoader(true);
  if (isFlatRate) {
    document.getElementById('shipping-amount').innerHTML = `฿${Number(logisticFee)}`;
    if (taxIncluded) {
      document.getElementById('total-amount').innerHTML = `฿${Number(totalAmount + Number(logisticFee) + Number(taxPrice.toFixed(2))).toFixed(2)}`;
    } else {
      document.getElementById('total-amount').innerHTML = `฿${Number(totalAmount + Number(logisticFee)).toFixed(2)}`;
    }
  } else {
    document.getElementById('shipping-amount').innerHTML = '฿0';
    document.getElementById('total-amount').innerHTML = `฿${Number(totalAmount).toFixed(2)}`;
    if (taxIncluded) {
      document.getElementById('total-amount').innerHTML = `฿${Number(totalAmount + Number(taxPrice.toFixed(2))).toFixed(2)}`;
    } else {
      document.getElementById('total-amount').innerHTML = `฿${Number(totalAmount).toFixed(2)}`;
    }
  }
  (<HTMLInputElement>document.getElementById('logis' + logisticID)).checked = true;

  const body = {
    logisticID,
  } as IPurchaseOrderPostbackSelectLogistic;
  const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
  const queryParams = getQueryParams('SELECT_LOGISTIC_METHOD', PSID);

  POST(`/purchase/postback?${queryParams}`, body, (isPass: boolean) => {
    toggleLoader(false);

    if (isPass) {
      // Change hash to selected logistic
      payloadData.hash = hashKey;

      const paymentMethods = document.getElementsByName('paymentMethod');
      if (paymentMethods) {
        const bank = document.getElementById('bank-group');
        if (bank) bank.style.display = 'none';

        const paypalGroupNode = document.getElementById('paypal-group');
        if (paypalGroupNode) paypalGroupNode.style.display = 'none';
        disableConfirmButton();

        const omiseGroupNode = document.getElementById('omise-group');
        if (omiseGroupNode) omiseGroupNode.style.display = 'none';
        disableConfirmButton();

        paymentMethods.forEach((element: HTMLInputElement) => {
          element.checked = false;
        });
      }

      showPaymentStep();

      if (isCOD) {
        showCodOption();
      } else {
        hideCodOption();
      }
    } else {
      // todo : alert
    }
  });
}
