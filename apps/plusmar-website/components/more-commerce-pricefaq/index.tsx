/* eslint-disable max-len */
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './more-commerce-pricefaq.module.scss';

export const Index = () => {
  const faqArray = [
    {
      question: 'More - Commerce คืออะไร?',
      answer: `More-Commerce แพลตฟอร์มบริหารจัดการการซื้อขายในอินบอกซ์ และการเก็บรายชื่อลูกค้า โดยสามารถติดตามทุกขั้นตอนการซื้อขาย เก็บข้อมูลการสั่งซื้อ ประวัติ และจัดแยกหมวดหมูของลูกค้าตามสถานะ

      นอกจากนั้นยังสามารถจัดการสินค้า โปรโมชั่น จัดการสต๊อก พร้อมการสร้างแคตตาล็อกแชร์ไปยังเพจ สามารถเพิ่มช่องทางการชำระเงินได้ไม่จำกัด เชื่อมกับระบบขนส่ง โดยมีการคำนวนน้ำหนัก ค่าจัดส่ง และปริ้นท์ใบปะหน้าพัสดุ ส่งสินค้าได้เลยทันที พร้อมตัวเลขการติดตามพัสดุ
      
      บันทึกข้อมูลทั้งหมดไว้ให้คุณและลูกค้าของคุณ สะดวก ไม่ต้องกรอกข้อมูลใหม่ในการสั่งซื้อครั้งถัดไป ระบบการจัดการบริการหลังการขาย ไม่พลาดทุกรายชื่อ`,
    },
    {
      question: 'ข้อแตกต่างระหว่างแพ็กเกจ Business กับ Commerce?',
      answer: (
        <div>
          <div>More-Commerce จะแบ่งการบริหารจัดการเพจ 2 แบบ</div>
          <div style={{ display: 'flex', paddingBottom: '10px' }}>
            <div style={{ width: '5%' }}>1.)</div>
            <div style={{ width: '95%' }}>
              Business Plan สำหรับธุรกิจที่ไม่ได้มีสินค้าที่ขายออนไลน์ แต่เน้นการเก็บรายชื่อลูกค้าเพื่อติดต่อขาย (Leads) เช่น ธุรกิจบริการ
              ธุรกิจที่จำเป็นต้องพูดคุยติดต่อลูกค้าเพื่ออธิบายรายละเอียดการขาย โดยมีระบบสร้างแบบฟอร์มสำหรับเก็บข้อมูลของลูกค้า ระบบจัดการอินบอกซ์ โดยรวมทุกแชทให้มาอยู่ในหน้าเดียว
              รวมถึงเก็บรายชื่อและประวัติ สถานะของลูกค้า เพื่อไม่ให้เกิดการตกหล่น และติดตามขายต่อได้สะดวก และยังมีระบบจัดการบริการหลังการขายด้วย
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '5%' }}>2.)</div>
            <div style={{ width: '95%' }}>
              Commerce Plan สำหรับธุรกิจที่ขายสินค้าออนไลน์ ตัวอย่างเช่น ขายเสื้อผ้าออนไลน์ ขายอุปกรณ์ใช้ในครัวเรือน หรือสินค้าเป็นชิ้น เป็นต้น
              โดยระบบออกแบบมาเพื่อให้สะดวกตั้งแต่สร้างข้อมูลสินค้า โดยแสดงสินค้าที่ลูกค้าสนใจ และแสดงสถานะ ประวัติ ข้อมูลการซื้อขายในทุกขั้นตอน เช่น ลูกค้า A
              กำลังอยู่ในขั้นตอนชำระเงิน ลูกค้า B อยู่ในขั้นตอนส่งของ ไปจนถึงระบบจัดการสต็อกสินค้า ตั้งค่าชำระเงิน ปริ้นท์ใบปะหน้าไปรษณีย์ ติดตามพัสดุ และบริการหลังการขาย
            </div>
          </div>
        </div>
      ),
    },
    {
      question: 'การเริ่มต้นใช้งานแพลตฟอร์ม และการอัพเกรดแพลน',
      answer: (
        <div>
          <div style={{ paddingBottom: '15px' }}>
            เริ่มต้นใช้งานได้เลยวันนี้ โดยเข้าสู่ระบบเพื่อเชื่อมต่อกับเพจของคุณ ตั้งค่า ร้านค้า ระบบชำระเงิน ระบบส่งของ และเริ่มต้นการอัพโหลดสินค้าลงในแพลตฟอร์ม
          </div>
          <div style={{ paddingBottom: '15px' }}>
            เมื่อมีการทักแชทเข้ามาซื้อขาย สิ่งที่ได้ตั้งค่าไว้ จะถูกดึงเข้ามาตอบให้กับลูกค้าโดยอัตโนมัติ ง่ายและสะดวกกับทั้งคุณและลูกค้า นอกจากนั้นยังสามารถเก็บรายชื่อ
            และสถานะทุกขั้นตอนซื้อขาย โดยแยกเป็นหมวดหมู่
          </div>
          <div style={{ paddingBottom: '15px' }}>
            หากต้องการอัพเกรดแพลนเพื่อใช้งานอย่างมืออาชีพ คุณสามารถเลือก Business Plan หรือ Commerce Plan ในราคาที่เหมาะกับขนาดและประเภทธุรกิจของคุณ เพื่อการจัดการที่มากกว่า
            โดยสามารถใช้งานฟีเจอร์ที่จะสนับสนุนธุรกิจคุณได้อย่างเต็มประสิทธิภาพ
          </div>
          <div>โดยหลังจากนั้นจะเก็บค่าบริการเป็นรายปี เริ่มนับตั้งแต่วันที่ชำระเงินไป 365 วัน เมื่อครบกำหนด เราสามารถต่ออายุเป็นแผนเดิม หรืออัพเกรดขึ้นก็ได้</div>
        </div>
      ),
    },
    // ,
    // {
    //   question: 'เงื่อนไขการให้บริการ และการคืนเงิน',
    //   answer: (
    //     <div>
    //       <div style={{ paddingBottom: '15px' }}>
    //         การเชื่อมต่อแพลตฟอร์มเข้ากับเพจขายสินค้า จะต้องไม่เป็นสินค้าที่ผิดกฎหมาย การพนัน และการละเมิดลิขสิทธิ์ อาวุธ สารเสพติดทุกชนิด เครื่องสำอาง ยา หรืออาหารเสริม
    //         ที่ไม่ได้รับอนุญาตจาก อย. ไทย สินค้าที่มีการโฆษณาเกินจริง ดูรายละเอียดเพิ่มเติมที่{' '}
    //         <a href={'https://www.itopplus.com/condition-page'} target={'_blank'} rel="noopener noreferrer">
    //           {' '}
    //           เงื่อนไขการให้บริการ
    //         </a>
    //       </div>
    //       <div style={{ paddingBottom: '15px' }}>
    //         หากตรวจพบร้านค้าที่ผิดข้อตกลง เราจะดำเนินการงดการให้บริการทันที โดยไม่มีการคืนค่าบริการ และสงวนสิทธิ์ในการแจ้งให้ทราบล่วงหน้า
    //         ในกรณีที่มีข้อโต้แย้งถือเอาคำตัดสินของบริษัทเป็นที่สิ้นสุด
    //       </div>
    //       <div>
    //         บริษัทขอสงวนสิทธิ์ในการคืนค่าบริการ ในกรณีที่ผู้ใช้ต้องการยกเลิกใช้บริการ หรือปรับลดบริการลง ก่อนครบกำหนดสัญญา และผู้ใช้บริการไม่มีสิทธิ์เรียกค่าบริการคืน
    //         ไม่ว่าบางส่วนหรือทั้งหมดได้ เว้นแต่ทางผู้ให้บริการจะเป็นผู้ยกเลิกบริการเอง อ่านเงื่อนไขการให้บริการและการคืนเงินเพิ่มเติม{' '}
    //         <a href={'https://www.itopplus.com/condition-page'} target={'_blank'} rel="noopener noreferrer">
    //           {' '}
    //           เงื่อนไขการให้บริการ
    //         </a>
    //       </div>
    //     </div>
    //   ),
    // },
  ];

  const [plusImage0, setPlus0] = useState('/images/pricingPage/Plus.svg');
  const [plusImage1, setPlus1] = useState('/images/pricingPage/Plus.svg');
  const [plusImage2, setPlus2] = useState('/images/pricingPage/Plus.svg');
  const [plusImage3, setPlus3] = useState('/images/pricingPage/Plus.svg');

  const [bg00, setBGcolor0] = useState(styles.unactive);
  const [bg01, setBGcolor1] = useState(styles.unactive);
  const [bg02, setBGcolor2] = useState(styles.unactive);
  const [bg03, setBGcolor3] = useState(styles.unactive);

  const toggleContent = (ind, event) => {
    // event.toggle();
    switch (ind) {
      case 0:
        if (plusImage0.indexOf('Plus.svg') !== -1) {
          setBGcolor0(styles.active);
          setPlus0('/images/pricingPage/Dash.svg');
          setPlus1('/images/pricingPage/Plus.svg');
          setPlus2('/images/pricingPage/Plus.svg');
          setPlus3('/images/pricingPage/Plus.svg');
          setBGcolor1(styles.unactive);
          setBGcolor2(styles.unactive);
          setBGcolor3(styles.unactive);
        } else {
          setBGcolor0(styles.unactive);
          setPlus0('/images/pricingPage/Plus.svg');
        }
        break;
      case 1:
        if (plusImage1.indexOf('Plus.svg') !== -1) {
          setBGcolor1(styles.active);
          setPlus1('/images/pricingPage/Dash.svg');
          setPlus0('/images/pricingPage/Plus.svg');
          setPlus2('/images/pricingPage/Plus.svg');
          setPlus3('/images/pricingPage/Plus.svg');
          setBGcolor0(styles.unactive);
          setBGcolor2(styles.unactive);
          setBGcolor3(styles.unactive);
        } else {
          setBGcolor1(styles.unactive);
          setPlus1('/images/pricingPage/Plus.svg');
        }

        break;
      case 2:
        if (plusImage2.indexOf('Plus.svg') !== -1) {
          setBGcolor2(styles.active);
          setPlus2('/images/pricingPage/Dash.svg');
          setPlus0('/images/pricingPage/Plus.svg');
          setPlus1('/images/pricingPage/Plus.svg');
          setPlus3('/images/pricingPage/Plus.svg');
          setBGcolor0(styles.unactive);
          setBGcolor1(styles.unactive);
          setBGcolor3(styles.unactive);
        } else {
          setBGcolor2(styles.unactive);
          setPlus2('/images/pricingPage/Plus.svg');
        }

        break;
      case 3:
        if (plusImage3.indexOf('Plus.svg') !== -1) {
          setBGcolor3(styles.active);
          setPlus3('/images/pricingPage/Dash.svg');
          setPlus0('/images/pricingPage/Plus.svg');
          setPlus1('/images/pricingPage/Plus.svg');
          setPlus2('/images/pricingPage/Plus.svg');
          setBGcolor0(styles.unactive);
          setBGcolor1(styles.unactive);
          setBGcolor2(styles.unactive);
        } else {
          setBGcolor3(styles.unactive);
          setPlus3('/images/pricingPage/Plus.svg');
        }

        break;
    }
  };

  const setImage = (ind) => {
    switch (ind) {
      case 0:
        return plusImage0;
      case 1:
        return plusImage1;
      case 2:
        return plusImage2;
      case 3:
        return plusImage3;
    }
  };

  const setbackgroundAnimate = (ind) => {
    switch (ind) {
      case 0:
        return bg00;
      case 1:
        return bg01;
      case 2:
        return bg02;
      case 3:
        return bg03;
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.flexContainer}>
        {faqArray.map((data, index) => (
          <div
            key={index}
            className={`${styles.toggleContainer} ${setbackgroundAnimate(index)}`}
            onClick={() => {
              toggleContent(index, document.getElementById('toggleNumber' + index));
            }}
          >
            <div className={styles.leftSideContent}>
              <div className={styles.questionContent}>{data.question}</div>
              <div id={'toggleNumber' + index} className={styles.answerContent}>
                {data.answer}
              </div>
            </div>
            <div className={styles.rightSideContent}>
              <Image className={styles.imageToggle} alt={'imageTogglePrice' + index} width="16" height="16" src={setImage(index)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Index;
