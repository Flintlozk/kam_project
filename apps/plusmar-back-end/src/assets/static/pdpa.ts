// eslint-disable-next-line
declare let options: { textENG: string; textTH: string };
window.onload = function (): void {
  document.getElementById('textENG').innerHTML = options.textENG;
  document.getElementById('textTH').innerHTML = options.textTH;
};

// eslint-disable-next-line
function onClickAcceptConsent() {
  history.back();
}
