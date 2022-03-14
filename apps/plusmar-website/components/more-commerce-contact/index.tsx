import React, { useState } from 'react';

import styles from './more-commerce-contact.module.scss';
// import { createMailOption, createTransporter, IEmail, ISmtpConfig } from '../../public/lib/nodemailer.lib';
// import { createMailOption, createTransporter } from '@reactor-room/itopplus-back-end-helpers';
// import * as config from '../../nodemailer.json';
let customerEmail = '';
let customerService = '';
let customerMessage = '';

interface IHTTPResult {
  status: number;
  value: any;
  expiresAt?: string;
}

const validateEmail = (value) => {
  const rex = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return rex.test(value);
};

const validateService = (value) => {
  if (value !== '') {
    return true;
  } else {
    return false;
  }
};
const validateMessage = (value) => {
  if (value !== '') {
    return true;
  } else {
    return false;
  }
};

// export async function sendContactEmail(invitationEmail: IEmail, transporter): Promise<IHTTPResult> {
//   return new Promise<IHTTPResult>(async (resolve, reject) => {
//     try {
//       const data = transporter.sendMail(invitationEmail);
//       data.then(
//         (result: any) => {
//           const response: IHTTPResult = {
//             status: 200,
//             value: 'Send Contact us email successfully!',
//           };
//           resolve(response);
//         },
//         (err: any) => {
//           if (err) reject(err);
//         }
//       );
//     } catch (err) {
//       reject(err);
//     }
//   });
// }

const createEmailContactTemplate = (email, topic, message) => {
  const html = `<div style="width:100%;">
  <div style="width: 600px;">
      <div style="line-height:1.2;font-size:12px;color:#555555;font-family:Arial,Helvetica Neue,Helvetica,sans-serif">
          <p style="line-height:1.2;word-break:break-word;font-size:22px;margin:0"><span
                  style="font-size:14px"><strong>สายตรงถึงผู้บริหาร</strong></span></p>
          <ul>
              <li style="line-height:1.2;font-size:14px"><span style="font-size:14px">Email : ${email}</span></li>
              <li style="line-height:1.2;font-size:14px"><span style="font-size:14px">Topic : ${topic}</span></li>
              <li style="line-height:1.2;font-size:14px"><span style="font-size:14px">Message : ${message}</span></li>
          </ul>

      </div>
  </div>
</div>`;
  return html;
};

const sendEmailToCustomer = (cusEmail, topic, message) => {
  const mailForm = 'no-reply@more-commerce.com';
  // const mailTo = 'support@more-commerce.com,marketing@theiconweb.com';

  const mailTo = 'anan@theiconweb.com';
  const subject = 'Support More-Commerce';
  const htmlBody: string = createEmailContactTemplate(cusEmail, topic, message);
  // const invitationEmail = createMailOption(mailForm, mailTo, subject, htmlBody);
  // const transporter = createTransporter(config);
  // return await sendContactEmail(invitationEmail, transporter);
};

export const Index = () => {
  // let message = '';
  const [validEmail, setValidEmail] = useState(true);
  const [validService, setValidService] = useState(true);
  const [validMessage, setValidMessage] = useState(true);
  const typeEmail = (e) => {
    customerEmail = e.target.value;
  };
  const selectService = (e) => {
    customerService = e.target.value;
  };
  const typeMessage = (e) => {
    customerMessage = e.target.value;
  };

  const sendEmailContactUs = () => {
    // console.log('customerEmail : ', customerEmail);
    if (!validateEmail(customerEmail)) {
      setValidEmail(false);
      setValidMessage(true);
      setValidService(true);
      // console.log('INVALID Email : ', validEmail);
    } else if (!validateService(customerService)) {
      setValidService(false);
      setValidEmail(true);
      // console.log('INVALID Service : ', validService);
    } else if (!validateMessage(customerMessage)) {
      setValidMessage(false);
      setValidService(true);
      setValidEmail(true);
      // console.log('INVALID Message : ', validMessage);
    } else {
      setValidEmail(true);
      setValidService(true);
      setValidMessage(true);
      void sendEmailToCustomer(customerEmail, customerService, customerMessage);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.flexContainer}>
        <div className={styles.titleFont}>Send us a message.</div>
        <div className={styles.descriptionFont}>Fill out the form below to report a bug or inquire about anything and we will get back to you prompty.</div>
        <div className={styles.yourEmail}>
          <label htmlFor={'contactMoreEmail'}>Your Email</label>
        </div>
        <input
          id="contactMoreEmail"
          className={styles.inputEmail}
          placeholder={'Name@youremail.com'}
          onChange={(e) => {
            typeEmail(e);
          }}
        />
        {!validEmail && <label className={styles.validateEmail}>กรุณากรอก Email ของท่านให้ครบถ้วน</label>}
        <div className={styles.messageTopic}>
          <label htmlFor={'carsMore'}>Message topic</label>
        </div>
        <select
          defaultValue={'DEFAULT'}
          className={styles.inputSelect}
          id="carsMore"
          name="carlist"
          form="carform"
          onChange={(e) => {
            selectService(e);
          }}
        >
          <option value={'DEFAULT'} disabled>
            Select a topic
          </option>
          <option value="sales">Sales</option>
          <option value="customerservice">Customer Service</option>
          <option value="technicalissues">Technical Issues</option>
          <option value="other">Other</option>
        </select>
        {!validService && <div className={styles.validateEmail}>กรุณาเลือก Topic ที่คุณสนใจ</div>}
        <div className={styles.message}>
          <label htmlFor={'MoreTextArea'}>Message</label>
        </div>
        <textarea
          id="MoreTextArea"
          className={styles.inputTextArea}
          onChange={(e) => {
            typeMessage(e);
          }}
        />
        {!validMessage && <div className={styles.validateEmail}>กรุณากรอกข้อมูลให้ครบถ้วน</div>}
        <div className={styles.paddingDiv}>
          <button
            className={styles.buttonContact}
            onClick={() => {
              sendEmailContactUs();
            }}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};
export default Index;
