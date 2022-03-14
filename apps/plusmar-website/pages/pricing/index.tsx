import React, { useState } from 'react';
import Image from 'next/image';
import styles from './pricing.module.scss';
import stylesMode from '../../components/pricing-mode2/pricing-mode2.module.scss';
import Link from 'next/link';
import Header from '../../components/header';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import PriceMode2 from '../../components/pricing-mode2';
import PricingFAQ from '../../components/more-commerce-pricefaq';
import TrainingImage from '../../components/image-training';
interface PropsInterface {
  mainPage?: boolean;
  isFeaturesPage?: boolean;
}
export const Index = ({ mainPage, isFeaturesPage }: PropsInterface) => {
  const priceTypeProps = [
    {
      title: 'FREE TRIAL',
      price: 'Free',
      type: 1,
      description: 'ทดลองใช้ฟีเจอร์พื้นฐาน สำหรับร้านค้า ซื้อขายสินค้าได้เต็มรูปแบบ',
      button: <button className={stylesMode.freeButton}>Try For Free</button>,
      infomationData: [
        {
          name: 'เชื่อมต่อ Facebook Fan Page, Inbox, Comment & Live',
          value: '1 เพจ',
        },
        {
          name: 'เชื่อมต่อ Line Official Account',
          value: <span className={stylesMode.dashNormal}>-</span>,
        },
        {
          name: 'แอดมินเข้าใช้งานได้ทั้งหมด',
          value: '1 คน',
        },
        {
          name: 'แชทกับลูกค้าได้สูงสุด',
          value: 'ไม่จำกัด',
        },
        {
          name: 'แยกสถานะลูกค้าตามความสนใจ',
          value: 'ไม่จำกัด',
        },
        {
          name: 'แท็กแยกประเภทลูกค้า',
          value: 'ไม่จำกัด',
        },
        {
          name: 'จำนวนข้อความแชทกับลูกค้า',
          value: 'ไม่จำกัด',
        },
        {
          name: 'สร้างสินค้าและจัดการสต๊อก',
          value: 'ไม่จำกัด',
        },
        {
          name: 'จำนวนการเปิดบิล',
          value: '10 ใบ/เดือน',
        },
        {
          name: 'ออกใบเสร็จรับเงิน',
          value: '10 ใบ/เดือน',
        },
        {
          name: 'ระบบจัดส่ง และพิมพ์ใบปะหน้าพัสดุ',
          value: 'ไม่จำกัด',
        },
        {
          name: 'ช่องทางการชำระเงินอัตโนมัติ',
          value: <Image className={stylesMode.freeChecker} alt={'imgRightArrow12'} width="14" height="10" src={'/images/Right-Orange.svg'} />,
        },
        {
          name: 'รายงานสถิติการติดต่อจากลูกค้า',
          value: <Image className={stylesMode.freeChecker} alt={'imgRightArrow13'} width="14" height="10" src={'/images/Right-Orange.svg'} />,
        },
        {
          name: 'สร้างแบบฟอร์มเก็บข้อมูลลูกค้า',
          value: <Image className={stylesMode.freeChecker} alt={'imgRightArrow14'} width="14" height="10" src={'/images/Right-Orange.svg'} />,
        },
        {
          name: 'คีย์ลัดข้อความตอบกลับอัตโนมัติ',
          value: <Image className={stylesMode.freeChecker} alt={'imgRightArrow15'} width="14" height="10" src={'/images/Right-Orange.svg'} />,
        },
        {
          name: 'ระบุแอดมินที่ตอบกลับลูกค้า',
          value: <Image className={stylesMode.freeChecker} alt={'imgRightArrow16'} width="14" height="10" src={'/images/Right-Orange.svg'} />,
        },
        {
          name: (
            <>
              <span className={stylesMode.freeColor}>FREE</span> อบรมการใช้งานระบบ
            </>
          ),
          value: 'ไม่จำกัด',
        },
      ],
    },
    {
      title: 'BUSINESS',
      price: (
        <>
          23,500<span className={stylesMode.smallYear}>บาท/ปี</span>
        </>
      ),
      type: 2,
      description: 'ฟีเจอร์สำหรับธุรกิจที่ต้องเก็บรายชื่อลูกค้า เพื่อให้ Sales ติดต่อก่อนซื้อขาย',
      button: <button className={stylesMode.businessButton}>Subscribe</button>,
      infomationData: [
        {
          name: 'เชื่อมต่อ Facebook Fan Page, Inbox, Comment & Live',
          value: '1 เพจ',
        },
        {
          name: 'เชื่อมต่อ Line Official Account',
          value: '1 บัญชี*',
        },
        {
          name: 'แอดมินเข้าใช้งานได้ทั้งหมด',
          value: '5 คน',
        },
        {
          name: 'แชทกับลูกค้าได้สูงสุด',
          value: 'ไม่จำกัด',
        },
        {
          name: 'แยกสถานะลูกค้าตามความสนใจ',
          value: 'ไม่จำกัด',
        },
        {
          name: 'แท็กแยกประเภทลูกค้า',
          value: 'ไม่จำกัด',
        },
        {
          name: 'จำนวนข้อความแชทกับลูกค้า',
          value: 'ไม่จำกัด',
        },
        {
          name: 'สร้างสินค้าและจัดการสต๊อก',
          value: <span className={stylesMode.dashNormal}>-</span>,
        },
        {
          name: 'จำนวนการเปิดบิล',
          value: <span className={stylesMode.dashNormal}>-</span>,
        },
        {
          name: 'ออกใบเสร็จรับเงิน',
          value: <span className={stylesMode.dashNormal}>-</span>,
        },
        {
          name: 'ระบบจัดส่ง และพิมพ์ใบปะหน้าพัสดุ',
          value: <span className={stylesMode.dashNormal}>-</span>,
        },
        {
          name: 'ช่องทางการชำระเงินอัตโนมัติ',
          value: <span className={stylesMode.dashNormal}>-</span>,
        },
        {
          name: 'รายงานสถิติการติดต่อจากลูกค้า',
          value: <Image className={stylesMode.businessChecker} alt={'imgRightArrow8'} width="14" height="10" src={'/images/pricingPage/Right-Violet.svg'} />,
        },
        {
          name: 'สร้างแบบฟอร์มเก็บข้อมูลลูกค้า',
          value: <Image className={stylesMode.businessChecker} alt={'imgRightArrow9'} width="14" height="10" src={'/images/pricingPage/Right-Violet.svg'} />,
        },
        {
          name: 'คีย์ลัดข้อความตอบกลับอัตโนมัติ',
          value: <Image className={stylesMode.businessChecker} alt={'imgRightArrow10'} width="14" height="10" src={'/images/pricingPage/Right-Violet.svg'} />,
        },
        {
          name: 'ระบุแอดมินที่ตอบกลับลูกค้า',
          value: <Image className={stylesMode.businessChecker} alt={'imgRightArrow11'} width="14" height="10" src={'/images/pricingPage/Right-Violet.svg'} />,
        },
        {
          name: (
            <>
              <span className={stylesMode.freeColor}>FREE</span> อบรมการใช้งานระบบ
            </>
          ),
          value: 'ไม่จำกัด',
        },
      ],
    },
    {
      title: 'COMMERCE',
      price: (
        <>
          33,500<span className={stylesMode.smallYear}>บาท/ปี</span>
        </>
      ),
      type: 3,
      description: 'ฟีเจอร์สำหรับธุรกิจซื้อขายสินค้าออนไลน์ ซื้อขายสินค้าได้อย่างไม่จำกัด',
      button: <button className={stylesMode.commerceButton}>Subscribe</button>,
      infomationData: [
        {
          name: 'เชื่อมต่อ Facebook Fan Page, Inbox, Comment & Live',
          value: '1 เพจ',
        },
        {
          name: 'เชื่อมต่อ Line Official Account',
          value: '1 บัญชี*',
        },
        {
          name: 'แอดมินเข้าใช้งานได้ทั้งหมด',
          value: '5 คน',
        },
        {
          name: 'แชทกับลูกค้าได้สูงสุด',
          value: 'ไม่จำกัด',
        },
        {
          name: 'แยกสถานะลูกค้าตามความสนใจ',
          value: 'ไม่จำกัด',
        },
        {
          name: 'แท็กแยกประเภทลูกค้า',
          value: 'ไม่จำกัด',
        },
        {
          name: 'จำนวนข้อความแชทกับลูกค้า',
          value: 'ไม่จำกัด',
        },
        {
          name: 'สร้างสินค้าและจัดการสต๊อก',
          value: 'ไม่จำกัด',
        },
        {
          name: 'จำนวนการเปิดบิล',
          value: 'ไม่จำกัด',
        },
        {
          name: 'ออกใบเสร็จรับเงิน',
          value: 'ไม่จำกัด',
        },
        {
          name: 'ระบบจัดส่ง และพิมพ์ใบปะหน้าพัสดุ',
          value: 'ไม่จำกัด',
        },
        {
          name: 'ช่องทางการชำระเงินอัตโนมัติ',
          value: <Image className={stylesMode.commerceChecker} alt={'imgRightArrow7'} width="14" height="10" src={'/images/pricingPage/Right.svg'} />,
        },
        {
          name: 'รายงานสถิติการติดต่อจากลูกค้า',
          value: <Image className={stylesMode.commerceChecker} alt={'imgRightArrow8'} width="14" height="10" src={'/images/pricingPage/Right.svg'} />,
        },
        {
          name: 'สร้างแบบฟอร์มเก็บข้อมูลลูกค้า',
          value: <Image className={stylesMode.commerceChecker} alt={'imgRightArrow13'} width="14" height="10" src={'/images/pricingPage/Right.svg'} />,
        },
        {
          name: 'คีย์ลัดข้อความตอบกลับอัตโนมัติ',
          value: <Image className={stylesMode.commerceChecker} alt={'imgRightArrow14'} width="14" height="10" src={'/images/pricingPage/Right.svg'} />,
        },
        {
          name: 'ระบุแอดมินที่ตอบกลับลูกค้า',
          value: <Image className={stylesMode.commerceChecker} alt={'imgRightArrow15'} width="14" height="10" src={'/images/pricingPage/Right.svg'} />,
        },
        {
          name: (
            <>
              <span className={stylesMode.freeColor}>FREE</span> อบรมการใช้งานระบบ
            </>
          ),
          value: 'ไม่จำกัด',
        },
      ],
    },
  ];

  const [FAQ, setFAQ] = useState('Frequently Asked Questions');
  React.useEffect(() => {
    if (window.innerWidth <= 766) {
      setFAQ('FAQ');
    }
  }, []);

  return (
    <>
      <Header />
      <div className={styles.mainPageContainer}>
        <div className={styles.mainPageTopMenu}>
          <Navbar mainPage={mainPage} isFeaturesPage={isFeaturesPage} />
        </div>
        <div className={styles.pricingContainer}>
          <div className={styles.priceTitle}>Pricing</div>
          <div className={styles.MorePriceContent}>
            <PriceMode2 propsData={priceTypeProps} />
          </div>
        </div>
        <div className={styles.vatContainer}>
          <div className={styles.vatTitle}>ราคาไม่รวมภาษีมูลค่าเพิ่ม (VAT) 7% </div>
          <div className={styles.vatTitle}> *เงื่อนไขการเชื่อมต่อกับ LINE Official Account (LINEOA)</div>
          <div className={styles.vatDetail}>
            {' '}
            - การเชื่อมต่อกับ LINE Official Account มีค่าใช้จ่ายเพิ่มเติม ที่คุณต้องจ่ายโดยตรงกับ LINE โดยราคาขึ้นอยู่กับแพ็กเกจรายเดือนของ LINE (เนื่องจากการส่งข้อความบน LINEOA
            ทางบริษัท LINE มีการจำกัดจำนวนการส่งข้อความต่อเดือน)
          </div>
          <div className={styles.vatDetail}> - แนะนำแพ็กเกจ 15,000 ข้อความ จ่ายโดยตรงกับ LINE 1,200 บาท/เดือน (เฉลี่ยเพียงข้อความละ 0.08 บาท)</div>
          <div className={styles.vatDetail}> - เชื่อมต่อได้เฉพาะบัญชี LINE Official Account ไม่สามารถเชื่อมต่อกับบัญชี LINE ส่วนตัวได้ </div>
        </div>
        <div className={styles.lineCondition}>
          <div className={styles.lineTitle}>แพ็กเกจรายเดือน LINE Official Account</div>
          <table>
            <tbody>
              <tr>
                <td>แพ็กเกจ</td>
                <td>FREE</td>
                <td>BASIC</td>
                <td>PRO</td>
              </tr>
              <tr>
                <td>ราคาแพ็กเกจ</td>
                <td>-</td>
                <td>1,200 บาท/เดือน</td>
                <td>1,500 บาท/เดือน</td>
              </tr>
              <tr>
                <td>จำนวนข้อความ</td>
                <td>1,000 ข้อความ</td>
                <td>15,000 ข้อความ</td>
                <td>35,000 ข้อความ</td>
              </tr>
              <tr>
                <td>ราคาเฉลี่ยต่อข้อความ</td>
                <td>-</td>
                <td>0.08 บาท</td>
                <td>0.04 บาท</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.trainingImageContainer}>
          <TrainingImage />
        </div>
        <div className={styles.pricingFAQContainer}>
          <div className={styles.faqTitle}>{FAQ}</div>
          <div className={styles.fsqTitleDescription}>คำถามที่พบบ่อยด้านเทคนิค และเกี่ยวกับแพลตฟอร์ม</div>
          <PricingFAQ />
        </div>
        <Footer />
      </div>
    </>
  );
};
export default Index;
