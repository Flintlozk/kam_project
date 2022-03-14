import React from 'react';
import styles from './more-commerce-feature.module.scss';

import BENEFITS_ICON01_optimized from '../../public/images/BENEFITS_ICON01_optimized.png';
import BENEFITS_ICON02_optimized from '../../public/images/BENEFITS_ICON02_optimized.png';
import BENEFITS_ICON03_optimized from '../../public/images/BENEFITS_ICON03_optimized.png';
import BENEFITS_ICON04_optimized from '../../public/images/BENEFITS_ICON04_optimized.png';
import BENEFITS_ICON05_optimized from '../../public/images/BENEFITS_ICON05_optimized.png';
import BENEFITS_ICON06_optimized from '../../public/images/BENEFITS_ICON06_optimized.png';

import CardFeature from './card-feature';
// interface PropsInterface {
//   propsData: [
//     {
//       imagePath: any;
//       title: string;
//       subtitle: string;
//       description: string;
//       news: boolean;
//       newWord: string;
//       newsColorWord: string;
//     }
//   ];
// }

export const Index = () => {
  const propsData = [
    {
      imagePath: BENEFITS_ICON01_optimized,
      title: 'บริหารจัดการอินบ็อกซ์',
      subtitle: 'Inbox Management',
      description: 'รวมแชทลูกค้าไว้ในที่เดียว ลูกค้าไม่หาย แยกสถานะลูกค้าให้ง่ายต่อการติดตาม',
      news: false,
      newWord: '',
      newsColorWord: '',
    },
    {
      imagePath: BENEFITS_ICON02_optimized,
      title: 'ซื้อขายทั้งระบบผ่านแชท',
      subtitle: 'Conversational Commerce',
      description: 'ให้ลูกค้าของคุณสั่งซื้อสินค้า จ่ายเงิน ใส่ที่อยู่ในการจัดส่ง และรอรับของ ทำทั้งหมดนี้ผ่านแชทได้เลย',
      news: true,
      newWord: 'COMMERCE',
      newsColorWord: '#0091ff',
    },
    {
      imagePath: BENEFITS_ICON03_optimized,
      title: 'เก็บรายชื่อลูกค้า',
      subtitle: 'Leads Generation',
      description: 'สำหรับธุรกิจที่ต้องมี Sales ติดต่อก่อนซื้อขาย ระบบสามารถเก็บรายชื่อลูกค้าที่สนใจ ให้คุณนำไปขายสินค้าต่อได้ทันที',
      news: true,
      newWord: 'BUSINESS',
      newsColorWord: '#534fdb',
    },
    {
      imagePath: BENEFITS_ICON04_optimized,
      title: 'แคตตาล็อกและสต็อกสินค้า',
      subtitle: 'Product, Catalog & Inventory',
      description: 'จัดการออเดอร์ จัดกลุ่มคำสั่งซื้ออย่างเป็นระบบ จัดการรายละเอียดสินค้า ราคา ค่าจัดส่ง',
      news: false,
      newWord: '',
      newsColorWord: '',
    },
    {
      imagePath: BENEFITS_ICON05_optimized,
      title: 'ช่องทางชำระ พร้อมระบบขนส่ง',
      subtitle: 'Payment Processing & Shipping Options',
      description: 'ระบบรองรับตั้งแต่เริ่ม จนจบการซื้อขาย เชื่อมกับ บริษัทขนส่งชั้นนำ หลากหลายช่องทางการชำระเงิน',
      news: false,
      newWord: '',
      newsColorWord: '',
    },
    {
      imagePath: BENEFITS_ICON06_optimized,
      title: 'ให้คำปรึกษาการใช้งานไม่จำกัด',
      subtitle: 'More Customer Training & Workshop',
      description: 'ทีมงานพร้อมช่วยตอบทุกคำถาม และแนะนำการใช้งานทีละขั้นตอน ไปพร้อมกับคุณ โทร. 02-029-1200',
      news: false,
      newWord: '',
      newsColorWord: '',
    },
  ];

  const cardContainer = propsData.map((data, index) => <CardFeature propsData={data} key={index} />);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.flexContainer}>{cardContainer}</div>
    </div>
  );
};

export default Index;
