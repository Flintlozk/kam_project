import { IPayment2C2PResponse } from '@reactor-room/itopplus-model-lib';
import { randomStringWithoutNumber } from '@reactor-room/itopplus-back-end-helpers';
import * as forge from 'node-forge';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export const payment2C2PSignHmacHha256 = (paymentRes: IPayment2C2PResponse, key: string): string => {
  // eslint-disable-next-line max-len
  const rawData = `${paymentRes.version}${paymentRes.request_timestamp}${paymentRes.merchant_id}${paymentRes.order_id}${paymentRes.invoice_no}${paymentRes.currency}${paymentRes.amount}${paymentRes.transaction_ref}${paymentRes.approval_code}${paymentRes.eci}${paymentRes.transaction_datetime}${paymentRes.payment_channel}${paymentRes.payment_status}${paymentRes.channel_response_code}${paymentRes.channel_response_desc}${paymentRes.masked_pan}${paymentRes.stored_card_unique_id}${paymentRes.backend_invoice}${paymentRes.paid_channel}${paymentRes.paid_agent}${paymentRes.recurring_unique_id}${paymentRes.user_defined_1}${paymentRes.user_defined_2}${paymentRes.user_defined_3}${paymentRes.user_defined_4}${paymentRes.user_defined_5}${paymentRes.browser_info}${paymentRes.ippPeriod}${paymentRes.ippInterestType}${paymentRes.ippInterestRate}${paymentRes.ippMerchantAbsorbRate}${paymentRes.payment_scheme}${paymentRes.process_by}${paymentRes.sub_merchant_list}`;
  const hmac = crypto.createHmac('sha256', key);
  const signed = hmac.update(Buffer.from(rawData, 'utf-8')).digest('hex');
  return signed;
};

export const create2C2POrderID = (purchaseOrderID: number): string => {
  const orderIdLength = purchaseOrderID.toString().length;
  const model = '0000000000';
  const orderID = `${model.substr(0, model.length - orderIdLength) + purchaseOrderID}${randomStringWithoutNumber(10)}`;
  return orderID;
};

export const createPOKey = (purchaseOrderID: number): string => {
  const orderIdLength = purchaseOrderID.toString().length;
  const model = '0000000000';
  const orderID = `${model.substr(0, model.length - orderIdLength) + purchaseOrderID}`;
  return orderID;
};

export const getRefundXML = ({
  version,
  merchantID,
  processType,
  invoiceNo,
  actionAmount,
  hashValue,
}: {
  version: string;
  merchantID: string;
  processType: string;
  invoiceNo: string;
  actionAmount: string;
  hashValue: string;
}): string => {
  const xml = `
  <PaymentProcessRequest>
    <version>${version}</version> 
    <merchantID>${merchantID}</merchantID>
    <processType>${processType}</processType>
    <invoiceNo>${invoiceNo}</invoiceNo> 
    <actionAmount>${actionAmount}</actionAmount> 
    <hashValue>${hashValue}</hashValue>
  </PaymentProcessRequest>;  
  `;
  return xml;
};

export const generatePKCS7 = (content: string): string => {
  const p7 = forge.pkcs7.createEnvelopedData();
  const filename = path.join(__dirname, 'cert.crt');
  let cert = '';
  if (fs.existsSync(filename)) {
    cert = forge.pki.certificateFromPem(fs.readFileSync(filename));
  } else {
    cert = forge.pki.certificateFromPem(process.env.PAYMENT_2C2P_PUBLIC_CERT);
  }
  p7.addRecipient(cert);
  p7.content = forge.util.createBuffer(content);
  p7.encrypt();
  const pem = forge.pkcs7.messageToPem(p7);
  return pem;
};
