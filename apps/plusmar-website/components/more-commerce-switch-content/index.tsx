import React from 'react';
import Image from 'next/image';
import styles from './more-commerce-switch-content.module.scss';

import FEATURE01_optimized from '../../public/images/FEATURE01_optimized.png';
import FEATURE02_optimized from '../../public/images/FEATURE02_optimized.png';
import FEATURE03_optimized from '../../public/images/FEATURE03_optimized.png';
import FEATURE04_optimized from '../../public/images/FEATURE04_optimized.png';
import FEATURE05_optimized from '../../public/images/FEATURE05_optimized.png';
import FEATURE06_optimized from '../../public/images/FEATURE06_optimized.png';

export const Index = () => {
  const contentSwitching = [
    {
      image: FEATURE01_optimized,
      side: 2,
      subTitle: 'INTERACTIVE DASHBOARD',
      title1: 'แสดงผลทุกรายละเอียดสรุปทุกสถิติ ที่คุณต้องรู้',
      title1Mobile: 'สรุปสถิติทุกยอดขาย ทุกสถานะของลูกค้า',
      detail: 'ตอบโจทย์ธุรกิจคุณ ด้วยการแสดงข้อมูลแบบอัตโนมัติ อัพเดททุกความเคลื่อนไหวแบบเรียลไทม์ ดูง่าย วัดผลสะดวก',
      detailMobile: 'แสดงข้อมูลแบบอัตโนมัติ อัพเดททุกความเคลื่อนไหวของยอดขาย สถานะลูกค้า แบบเรียลไทม์ ดูง่าย วัดผลสะดวก',
    },
    {
      image: FEATURE02_optimized,
      side: 1,
      subTitle: 'INBOX & COMMENT MANAGEMENT',
      title1: 'จัดการอินบ็อกซ์ คอมเม้นต์ อัจฉริยะในหน้าเดียว',
      title1Mobile: 'รวมแชท คอมเม้นต์ ไว้ในหน้าเดียว',
      detail: 'รวมแชท คอมเม้นต์ ของลูกค้า รวมถึงสินค้าที่ลูกค้ากำลังสนใจ ตอบกลับง่าย ครบทุกรายละเอียดในหน้าเดียว',
      detailMobile: 'รวมแชท คอมเม้นต์ ของลูกค้า รวมถึงสินค้าที่ลูกค้ากำลังสนใจ ไว้ในหน้าเดียว ตอบกลับง่าย รายชื่อไม่ตกหล่น',
    },
    {
      image: FEATURE03_optimized,
      side: 2,
      subTitle: 'CONVERSATIONAL COMMERCE',
      title1: 'ติดตามลูกค้า เก็บประวัติในทุกกระบวนการขาย',
      title1Mobile: 'ติดตามลูกค้า แยกตามสถานะ และเก็บประวัติ',
      detail: 'จัดหมวดหมู่ แยกสถานะลูกค้า เก็บและแสดงรายละเอียดในทุกขั้นตอนการซื้อขาย ให้ง่ายต่อการติดตามลูกค้า',
      detailMobile: 'แยกลูกค้าเป็นหมวดหมู่ แสดงสถานะการซื้อขาย เพื่อติดตามลูกค้าต่อได้ตรงประเด็น ชัดเจน',
    },
    {
      image: FEATURE04_optimized,
      side: 1,
      subTitle: 'CUSTOMER STATUS',
      title1: 'ครบตั้งแต่เริ่มยันปิดการขาย จบในแพลตฟอร์มเดียว',
      title1Mobile: 'บริหารจัดการสินค้าเชื่อมไปถึงปิดการขาย',
      detail: 'สร้างข้อมูลสินค้า แชร์ไปยังแฟนเพจ รวมถึงระบบจัดการแคตตาล็อก ปิดการขาย และบริการหลังการขายในแพลตฟอร์มเดียว',
      detailMobile: 'บริหารสินค้า แชร์ไปยังแฟนเพจ เพื่อเชื่อมกับระบบจัดการแคตตาล็อก และเชื่อมกับระบบปิดการขายผ่านแชท',
    },
    {
      image: FEATURE05_optimized,
      side: 2,
      subTitle: 'INVENTORY, PAYMENT & SHIPMENT',
      title1: 'จัดการสต็อก ระบบส่งของและใบปะหน้าพัสดุ',
      title1Mobile: 'จัดการสต็อก ระบบส่งของและใบปะหน้าพัสดุ',
      detail: 'ระบบตั้งค่าร้านค้าที่สมบูรณ์แบบ ชำระเงิน ส่งของ ปริ้นท์ใบปะหน้าพัสดุ ได้มาตรฐาน ไม่ต้องแยกทำหลายจุด',
      detailMobile: 'ระบบตั้งค่าร้านค้า การชำระเงิน การส่งสินค้า จัดการสต็อก ปริ้นท์ใบปะหน้าพัสดุ ได้มาตรฐาน ไม่ต้องแยกทำทีละจุด',
    },
    {
      image: FEATURE06_optimized,
      side: 1,
      subTitle: 'LEADS GENERATION',
      title1: 'เก็บรายชื่อ และข้อมูลลูกค้า ติดตามขายต่อสะดวก',
      title1Mobile: 'เก็บรายชื่อ และข้อมูลลูกค้าให้ติดตามขายต่อ',
      detail: 'เหมาะสำหรับธุรกิจที่ต้องมี Sales ติดต่อกลับ เพื่อนำเสนอสินค้าก่อนซื้อขาย ระบบสามารถเก็บรายชื่อลูกค้าที่สนใจ ให้คุณนำไปขายสินค้าต่อได้ทันที',
      detailMobile: 'เหมาะสำหรับธุรกิจที่ต้องมี Sales ติดต่อกลับ เพื่อนำเสนอสินค้าก่อนซื้อขาย ระบบสามารถเก็บรายชื่อลูกค้าที่สนใจ ให้คุณนำไปขายสินค้าต่อได้ทันที',
    },
  ];

  const contentSwitch = contentSwitching.map(({ image, side, subTitle, title1, title1Mobile, detail, detailMobile }, index) => {
    if (side === 1) {
      return (
        <div key={index} className={styles.contentContainer}>
          <div className={styles.leftContainer1}>
            <Image src={image} alt={'imageSwitch' + index} />
          </div>
          <div className={styles.gapContainer}></div>
          <div className={styles.rightContainer1}>
            <div className={styles.subTitleContent1}>{subTitle}</div>
            <div className={styles.titleContent11}>{title1}</div>
            <div className={styles.titleContentMobile1}>{title1Mobile}</div>
            <div className={styles.detailContent1}>{detail}</div>
            <div className={styles.detailContentMobile1}>{detailMobile}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div key={index} className={`${styles.contentContainer} ${styles.contentContainer2}`}>
          <div className={styles.leftContainer2}>
            <div className={styles.subTitleContent2}>{subTitle}</div>
            <div className={styles.titleContent12}>{title1}</div>
            <div className={styles.titleContentMobile2}>{title1Mobile}</div>
            <div className={styles.detailContent2}>{detail}</div>
            <div className={styles.detailContentMobile2}>{detailMobile}</div>
          </div>
          <div className={styles.gapContainer}></div>
          <div className={styles.rightContainer2}>
            <Image src={image} alt={'image-rightContainer' + index} />
          </div>
        </div>
      );
    }
  });

  return (
    <div className={styles.mainContainer}>
      <div className={styles.flexContainer}>{contentSwitch}</div>
    </div>
  );
};

export default Index;
