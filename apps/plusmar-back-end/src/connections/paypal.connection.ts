import * as paypal from '@paypal/checkout-server-sdk';

const _connected = false;
let paypalHttpClient;

export function getPaypalConnection(clientId: string, clientSecret: string) {
  if (_connected) {
    return paypalHttpClient;
  } else {
    const sandBoxEnvironment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    paypalHttpClient = new paypal.core.PayPalHttpClient(sandBoxEnvironment);
    return paypalHttpClient;
  }
}
