import type { IPipelineStep2Combined, PurchaseOrderPostbackPayload, WebhookQueries } from '@reactor-room/itopplus-model-lib';
declare let payloadData: IPipelineStep2Combined;
declare const toggleLoader: (on: boolean) => void;

// eslint-disable-next-line
function POST(path: string, data: PurchaseOrderPostbackPayload, callback: any): void {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', path);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
  xhr.onload = function () {
    if (xhr.status === 200) {
      if (xhr.responseText !== 'OK') callback(JSON.parse(xhr.responseText));
      else callback(xhr.responseText);
    } else callback(false);
  };
  if (data !== null) xhr.send(JSON.stringify(data));
  else xhr.send();
}

// eslint-disable-next-line
const getQueryParams = (response_type: string, psid: string): string => {
  const query = {
    auth: payloadData.auth,
    audienceId: payloadData.audienceId,
    hash: payloadData.hash,
  } as WebhookQueries;
  const params = new URLSearchParams({
    response_type,
    psid,
    ...query,
  });
  return params.toString();
};

// eslint-disable-next-line
function showToastr(text: string, second: number, className: string = 'show') {
  const toast = document.getElementById('snackbar');
  if (toast) {
    toast.innerHTML = text;
    toast.className = className;
    setTimeout(function () {
      toast.className = toast.className.replace(className, '');
    }, second * 1000);
  }
}
const EnumUserAgent = {
  WINDOWS: 'Windows',
  IPAD: 'IPad',
  IOS: 'IOS',
  MACOS: 'MacOS',
  UNIX: 'UNIX',
  ANDROID: 'Android',
  LINUX: 'Linux',
};
// eslint-disable-next-line
function checkIsProductSufficient(callback: (param: boolean) => void): void {
  try {
    toggleLoader(true);
    const PSID = (<HTMLInputElement>document.getElementById('psid')).value;
    const queryParams = getQueryParams('CHECK_PRODUCT_SUFFICIENT', PSID);

    POST(`/purchase/postback?${queryParams}`, null, function (isPass: boolean) {
      if (isPass) {
        callback(true);
      } else {
        showToastr('ขออภัย.. สินค้าไม่เพียงพอ', 6, 'alert');
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
function getUserAgent(): string {
  if (navigator.appVersion.indexOf('Win') !== -1) {
    return EnumUserAgent.WINDOWS;
  } else if (window.navigator.userAgent.match(/iPad/i)) {
    return EnumUserAgent.IPAD;
  } else if (window.navigator.userAgent.match(/iPhone/i)) {
    return EnumUserAgent.IOS;
  } else if (navigator.appVersion.indexOf('Mac') !== -1) {
    return EnumUserAgent.MACOS;
  } else if (navigator.appVersion.indexOf('X11') !== -1) {
    return EnumUserAgent.UNIX;
  } else if (navigator.appVersion.indexOf('Android') !== -1) {
    return EnumUserAgent.ANDROID;
  } else if (navigator.appVersion.indexOf('Linux') !== -1) {
    return EnumUserAgent.LINUX;
  }
}

// eslint-disable-next-line
function closePDPAModal(): void {
  document.getElementById('mc-pdpa-modal').remove();
}
// eslint-disable-next-line
function openDatause(): void {
  console.log('payloadData', payloadData);
  location.href = `/datause?auth=${payloadData.auth}&audienceId=${payloadData.audienceId}`;
}
// eslint-disable-next-line
function openTerms(): void {
  console.log('payloadData', payloadData);
  location.href = `/terms?auth=${payloadData.auth}&audienceId=${payloadData.audienceId}`;
  // document.getElementById('mc-pdpa-modal').remove();
}
