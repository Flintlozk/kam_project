import React from 'react';

import styles from './features.module.scss';

import Header from '../../components/header';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import FeaturesComponent from '../../components/feature-component';

import imageTitle1 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON01.png';
import imageTitle2 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON02.png';
import imageTitle3 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON03.png';
import imageTitle4 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON04.png';
import imageTitle5 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON05.png';
import imageTitle6 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON06.png';
import imageTitle7 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON07.png';
import imageTitle8 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON08.png';
import image1 from '../../public/images/featuresPage/FEATURES_DASHBOARD_optimized.png';
import image2 from '../../public/images/featuresPage/FEATURES_AUDIENCES_optimized.png';
import image3 from '../../public/images/featuresPage/FEATURES_LEADS_optimized.png';
import image4 from '../../public/images/featuresPage/FEATURES_FOLLOW_optimized.png';
import image5 from '../../public/images/featuresPage/FEATURES_CUSTOMER_optimized.png';
import image6 from '../../public/images/featuresPage/FEATURES_PRODUCTS_optimized.png';
import image7 from '../../public/images/featuresPage/FEATURES_PURCHASE_optimized.png';
import image8 from '../../public/images/featuresPage/FEATURES_SETTING_optimized.png';

import cardInfoDash1 from '../../public/images/featuresPage/icon64/01_ICON-FEATURE-Dashboard.png';
import cardInfoDash2 from '../../public/images/featuresPage/icon64/02_ICON-FEATURE-Dashboard.png';
import cardInfoDash3 from '../../public/images/featuresPage/icon64/03_ICON-FEATURE-Dashboard.png';
import cardInfoDash4 from '../../public/images/featuresPage/icon64/04_ICON-FEATURE-Dashboard.png';

import cardInfoAud1 from '../../public/images/featuresPage/icon64/05_ICON-FEATURE-Audiences.png';
import cardInfoAud2 from '../../public/images/featuresPage/icon64/06_ICON-FEATURE-Audiences.png';
import cardInfoAud3 from '../../public/images/featuresPage/icon64/07_ICON-FEATURE-Audiences.png';
import cardInfoAud4 from '../../public/images/featuresPage/icon64/08_ICON-FEATURE-Audiences.png';

import cardInfoLed1 from '../../public/images/featuresPage/icon64/09_ICON-FEATURE-Leads.png';
import cardInfoLed2 from '../../public/images/featuresPage/icon64/10_ICON-FEATURE-Leads.png';
import cardInfoLed3 from '../../public/images/featuresPage/icon64/11_ICON-FEATURE-Leads.png';
import cardInfoLed4 from '../../public/images/featuresPage/icon64/12_ICON-FEATURE-Leads.png';

import cardInfoFCus1 from '../../public/images/featuresPage/icon64/13_ICON-FEATURE-FollowCustomers.png';
import cardInfoFCus2 from '../../public/images/featuresPage/icon64/14_ICON-FEATURE-FollowCustomers.png';
import cardInfoFCus3 from '../../public/images/featuresPage/icon64/15_ICON-FEATURE-FollowCustomers.png';
import cardInfoFCus4 from '../../public/images/featuresPage/icon64/16_ICON-FEATURE-FollowCustomers.png';

import cardInfoCus1 from '../../public/images/featuresPage/icon64/17_ICON-FEATURE-Customers.png';
import cardInfoCus2 from '../../public/images/featuresPage/icon64/18_ICON-FEATURE-Customers.png';
import cardInfoCus3 from '../../public/images/featuresPage/icon64/19_ICON-FEATURE-Customers.png';
import cardInfoCus4 from '../../public/images/featuresPage/icon64/20_ICON-FEATURE-Customers.png';

import cardInfoProd1 from '../../public/images/featuresPage/icon64/21_ICON-FEATURE-Products.png';
import cardInfoProd2 from '../../public/images/featuresPage/icon64/22_ICON-FEATURE-Products.png';
import cardInfoProd3 from '../../public/images/featuresPage/icon64/23_ICON-FEATURE-Products.png';
import cardInfoProd4 from '../../public/images/featuresPage/icon64/24_ICON-FEATURE-Products.png';

import cardInfoPOD1 from '../../public/images/featuresPage/icon64/25_ICON-FEATURE-PurchaseOrder.png';
import cardInfoPOD2 from '../../public/images/featuresPage/icon64/26_ICON-FEATURE-PurchaseOrder.png';
import cardInfoPOD3 from '../../public/images/featuresPage/icon64/27_ICON-FEATURE-PurchaseOrder.png';
import cardInfoPOD4 from '../../public/images/featuresPage/icon64/28_ICON-FEATURE-PurchaseOrder.png';

import cardInfoSet1 from '../../public/images/featuresPage/icon64/29_ICON-FEATURE-Settings.png';
import cardInfoSet2 from '../../public/images/featuresPage/icon64/30_ICON-FEATURE-Settings.png';
import cardInfoSet3 from '../../public/images/featuresPage/icon64/31_ICON-FEATURE-Settings.png';
import cardInfoSet4 from '../../public/images/featuresPage/icon64/32_ICON-FEATURE-Settings.png';

import toggleImage1 from '../../public/images/featuresPage/MINI/Dashboard1_optimized.png';
import toggleImage2 from '../../public/images/featuresPage/MINI/Audiences1_optimized.png';
import toggleImage3 from '../../public/images/featuresPage/MINI/Leads1_optimized.png';
import toggleImage4 from '../../public/images/featuresPage/MINI/Follow1_optimized.png';
import toggleImage5 from '../../public/images/featuresPage/MINI/Customers1_optimized.png';
import toggleImage6 from '../../public/images/featuresPage/MINI/Products1_optimized.png';
import toggleImage7 from '../../public/images/featuresPage/MINI/PurchaseOrder1_optimized.png';
import toggleImage8 from '../../public/images/featuresPage/MINI/Setting1_optimized.png';

interface PropsInterface {
  mainPage?: boolean;
  isFeaturesPage?: boolean;
}
export const Index = ({ mainPage, isFeaturesPage }: PropsInterface) => {
  mainPage = false;
  isFeaturesPage = true;

  const FeatureData = [
    {
      featureTwoSide: {
        imageTitle: imageTitle1,
        title: 'Dashboard',
        detail: 'รายงานสถิติสถานะลูกค้า ทุกขั้นตอนการขาย ดูง่าย ตัดสินใจทางธุรกิจได้ทันที',
        idTitle: 'morefeature001',
        image: image1,
      },
      featureCardInfo: {
        titleNormal1: 'รายงานทุกความเคลื่อนไหวของร้านค้า',
        titleNormal2: 'ให้คุณวัดผลได้ ',
        titleBlue: 'อย่างง่ายดาย',
        descriptionInfo: 'แสดงข้อมูลของลูกค้าในทุกประเภท ในทุกขั้นตอนซื้อขายรายงานเป็นกราฟ แยกหมวดหมู่ชัดเจน ไว้ในหน้าเดียว',
        cardInfo: [
          {
            image: cardInfoDash1,
            title: 'ดูข้อมูลแบบเรียลไทม์ได้บนทุกอุปกรณ์',
            detail: 'ใช้งานได้บนเครื่องคอมพิวเตอร์ แท็บเล็ต และบนมือถือ ให้คุณติดตามดูข้อมูลได้ทุกที่ ทุกเวลา และทุกเบราว์เซอร์',
          },
          {
            image: cardInfoDash2,
            title: 'สรุปทุกอย่างที่คุณต้องรู้ รวมไว้ในหน้าเดียว',
            detail: 'มองเห็นภาพรวมของร้านค้า จำนวนลูกค้าทั้งหมดมีเท่าไร และเข้ามาจากช่องทางใด รวมไปถึงข้อมูลการซื้อขายทั้งระบบ',
          },
          {
            image: cardInfoDash3,
            title: 'เลือกช่วงเวลาแสดงผลของข้อมูลได้',
            detail: 'เลือกวัดผลการตลาด เป็นช่วงเวลา เช่น 7 วัน 14 วัน 1 เดือนหรือเลือกวันที่คุณต้องการโดยคลิกไอคอนปฏิทิน',
          },
          {
            image: cardInfoDash4,
            title: 'ดาวน์โหลดรายงานข้อมูลยอดขายและลูกค้า',
            detail: 'คุณสามารถบันทึกรายงานสถิติทั้งหมดของคุณเป็นไฟล์ Excel นำไปวัดผล และต่อยอดการทำการตลาดได้',
          },
        ],
      },
      toggleImageContent: {
        imageRight: toggleImage1,
        contentList: [
          {
            titleContent: 'Total Revenue',
            detailContent: 'แสดงตัวเลขสรุปยอดขายทั้งหมด จากการซื้อขายสินค้าโดยสามารถดูแยกตามออร์เดอร์ได้ ที่ฟีเจอร์ Purchase Order',
            show: true,
          },
          {
            titleContent: 'Potential Customers',
            detailContent: 'แสดงจำนวนลูกค้าที่มีศักยภาพที่จะปิดการขายได้ ทั้งลูกค้าเดิม และลูกค้าใหม่ที่เข้ามาจากทุกๆ ช่องทางที่เชื่อมกับระบบ More-Commerce',
            show: true,
          },
          {
            titleContent: 'Leads',
            detailContent: 'แสดงจำนวน Leads ทั้งหมด ของร้านค้าเรา โดยแยกเป็น Leads ที่กำลังติดตามขอข้อมูล และจำนวน Leads ที่เราได้รับข้อมูลแล้ว',
            show: true,
          },
          {
            titleContent: 'New Messages',
            detailContent: 'การคอมเมนต์ และการแชท จะถูกเก็บเข้ามาในแพลตฟอร์ม ให้คุณและทีมสามารถติดตามเพื่อเก็บข้อมูล หรือขายสินค้าต่อไป',
            show: true,
          },
          {
            titleContent: 'Orders',
            detailContent: 'แสดงข้อมูลติดตามการขาย แบ่งเป็น 5 ขั้นตอน ตั้งแต่ติดตาม รอชำระเงิน ยืนยันการชำระเงิน ส่งสินค้า และปิดการขาย',
            show: false,
          },
          {
            titleContent: 'Customers',
            detailContent: 'รวบรวมจำนวนของลูกค้าที่มีโอกาสในการซื้อสินค้าของคุณ โดยแบ่งเป็นลูกค้าใหม่ และลูกค้าเดิมที่อยู่ในร้านค้าเรา',
            show: false,
          },
        ],
      },
    },
    {
      featureTwoSide: {
        imageTitle: imageTitle2,
        title: 'New Messages',
        detail: 'เห็นรายละเอียด สถานะลูกค้า เป็นหมวดหมู่ ง่ายต่อการพูดคุยและซื้อขายต่อไป',
        idTitle: 'morefeature002',
        image: image2,
      },
      featureCardInfo: {
        titleNormal1: 'รวมอินบ็อกซ์ และคอมเม้นต์ แบบเรียลไทม์',
        titleNormal2: 'แสดงทุกรายละเอียดของลูกค้า ',
        titleBlue: 'ที่คุณต้องรู้',
        descriptionInfo: 'จัดหมวดหมู่ และสถานะของลูกค้า รวมถึงสินค้าที่ลูกค้าสนใจ เพื่อติดตามตอบกลับได้ง่าย สะดวก ไม่สับสนในการตอบลูกค้า',
        cardInfo: [
          {
            image: cardInfoAud1,
            title: 'แจ้งเตือน จำนวนลูกค้าที่เข้ามาแบบเรียลไทม์',
            detail: 'จำแนกว่าลูกค้าติดต่อมาจากช่องทางใด ไม่ว่าจะเป็นอินบ็อกซ์ หรือคอมเม้นต์ ระบบจะแจ้งเตือนให้คุณรู้ทันที',
          },
          {
            image: cardInfoAud2,
            title: 'แสดงประวัติการสนทนาของเรากับลูกค้า',
            detail: 'ฟีเจอร์ Detail จะแสดงข้อมูล ประวัติ การสนทนา และสามารถจัดหมวดหมู่ลูกค้าคนที่กำลังติดต่อได้',
          },
          {
            image: cardInfoAud3,
            title: 'แสดงข้อมูลลูกค้า พร้อมสินค้าที่ลูกค้าสนใจ',
            detail: 'คุณจะสามารถเห็นได้เลยว่า ลูกค้าของคุณสนใจสินค้าใด และคอมเม้นต์บนโพสต์ไหนบ้าง โดยเรียงตามช่วงเวลา',
          },
          {
            image: cardInfoAud4,
            title: 'จัดประเภท และส่งต่อลูกค้าไปขั้นตอนอื่นได้',
            detail: 'จัดกลุ่มให้ลูกค้า โดยเลือกเข้าสู่กระบวนการขายสินค้า หรือเก็บรายชื่อเพื่อพูดคุยติดตามต่อในอนาคต',
          },
        ],
      },
      toggleImageContent: {
        imageRight: toggleImage2,
        contentList: [
          {
            titleContent: 'Guests',
            detailContent: 'ลูกค้าที่เข้ามาติดต่อคุณผ่านทางอินบ็อกซ์ หรือคอมเม้นต์โดยจะมีตัวเลขแจ้งเตือนทุกครั้งที่มีการเคลื่อนไหว',
            show: true,
          },
          {
            titleContent: 'Automated Guests',
            detailContent: 'ลูกค้าที่คุณเลือกสถานะให้แล้ว โดยเลือกติดตามขาย หรือเก็บรายชื่อลูกค้าที่สนใจไว้เพื่อรอการติดตามต่อในอนาคต',
            show: true,
          },
          {
            titleContent: 'Total Post',
            detailContent: 'แสดงประวัติการคอมเม้นต์ทั้งหมดของลูกค้าแต่ละคน เรียงลำดับวัน-เวลา จากโพสต์แรกถึงโพสต์ล่าสุด',
            show: true,
          },
          {
            titleContent: 'Audience Score',
            detailContent: 'ดูได้ว่า ลูกค้าที่คอมเม้นต์ หรืออินบ็อกซ์เข้ามามีความสนใจสินค้ามากเท่าใด โดยระบบจากให้คะแนนตามความสนใจประเมินโดยระบบ AI. (เพิ่มมาใหม่)',
            show: true,
          },
          {
            titleContent: 'Interested Products',
            detailContent: 'เลือกแสดงลูกค้าที่สนใจสินค้าที่คุณต้องการได้ เพื่อวัดผลว่า สินค้าใดที่ได้รับความสนใจจากลูกค้ามากที่สุด',
            show: false,
          },
          {
            titleContent: 'Inbox, Comment & Reply',
            detailContent: 'คุณสามารถตอบกลับอินบอกซ์ หรือคอมเม้นต์ได้เลยทันที บนแพลตฟอร์ม พร้อมการแนบไฟล์ภาพสินค้าเพิ่มเติม',
            show: false,
          },
          {
            titleContent: 'Order History',
            detailContent: 'แสดงประวัติการสั่งซื้อสินค้าของลูกค้าคุณ เพื่อทำการวิเคราะห์ศักยภาพในการซื้อสินค้า ของลูกค้าคนนั้น',
            show: false,
          },
        ],
      },
    },
    {
      featureTwoSide: {
        imageTitle: imageTitle3,
        title: 'Leads',
        detail: 'ระบบเก็บรายชื่อ และข้อมูลลูกค้า ให้รายชื่อไม่ตกหล่น ติดตามขายต่อสะดวก',
        idTitle: 'morefeature003',
        image: image3,
      },
      featureCardInfo: {
        titleNormal1: 'เก็บรายชื่อ ข้อมูลลูกค้า สำหรับผู้ไม่ขายสินค้าออนไลน์',
        titleNormal2: 'แยกหมวดหมู่ สถานะ ',
        titleBlue: 'ให้ติดต่อลูกค้าได้ตรงประเด็น',
        descriptionInfo: 'รวมถึงระบบส่งแบบฟอร์มกรอกข้อมูลให้ลูกค้า พร้อมเก็บประวัติ รายชื่อไม่ตกหล่น ติดต่อขายได้ถูกจุด',
        cardInfo: [
          {
            image: cardInfoLed1,
            title: 'ระบบรวบรวม Leads ข้อมูลสำคัญของธุรกิจ',
            detail: 'รวมรายชื่อ Leads เอาไว้ไม่ให้ตกหล่น ติดตามขายต่อได้สะดวก ไม่สับสน',
          },
          {
            image: cardInfoLed2,
            title: 'แยกสถานะของ Leads ให้ชัดเจน ดูง่าย',
            detail: 'คุณจะรู้ได้ทันทีว่า Leads ที่มีอยู่นั้นเป็นคนใหม่ หรือคนเก่า เราได้แยกสถานะเพื่อให้คุณติดต่อลูกค้าได้อย่างเข้าใจ',
          },
          {
            image: cardInfoLed3,
            title: 'ติดตามขายต่อสะดวกด้วยข้อมูลที่ครบถ้วน',
            detail: 'รวบรวมทุกข้อมูลของลูกค้าที่จำเป็นสำหรับการขาย และยังสามารถแก้ไข เพิ่มเติม ข้อมูลของลูกค้าได้',
          },
          {
            image: cardInfoLed4,
            title: 'เก็บประวัติ Leads ให้ขายต่อได้ตรงประเด็น',
            detail: 'มีประวัติของ Leads ในแต่ละคน ว่าผ่านขั้นตอนอะไรมาบ้าง ทำให้เราจัดการ พูดคุยได้อย่างรู้จุด ตรงประเด็น',
          },
        ],
      },
      toggleImageContent: {
        imageRight: toggleImage3,
        contentList: [
          {
            titleContent: 'Lead Forms',
            detailContent: 'สร้างแบบฟอร์มเก็บข้อมูลจากลูกค้า เลือกเฉพาะข้อมูลที่คุณต้องการในการเก็บ Leads และยังสามารถอัพเดท ข้อมูลได้โดยทีมผู้ดูแล',
            show: true,
          },
          {
            titleContent: 'Follow',
            detailContent: 'รวบรวมคนที่อยู่ในสถานะรอการกรอกข้อมูล ไว้ในที่เดียวกันให้คุณไม่พลาดทุกการติดตามเก็บข้อมูล',
            show: true,
          },
          {
            titleContent: 'Finished',
            detailContent: 'เมื่อลูกค้ากรอกแบบฟอร์มเรียบร้อย คุณจะได้รับชื่อและข้อมูลการติดต่อเก็บรวมไว้เป็นรายชื่อ แยกสถานะ หมวดหมู่ให้คุณพร้อมขายได้ทันที',
            show: true,
          },
          {
            titleContent: 'Export to Excel',
            detailContent: 'นำรายชื่อออกมาเป็นไฟล์ Excel เพื่อให้เป็นฐานข้อมูลต่อยอด ในอนาคตได้หลายรูปแบบ พร้อมแสดงวันเวลาการดาวน์โหลดข้อมูลล่าสุด',
            show: true,
          },
        ],
      },
    },
    {
      featureTwoSide: {
        imageTitle: imageTitle4,
        title: 'Orders',
        detail: 'ระบบติดตามลูกค้า แยกเป็นหมวดหมู่ เข้าจัดการทุกขั้นตอนการขายได้สะดวก',
        idTitle: 'morefeature004',
        image: image4,
      },
      featureCardInfo: {
        titleNormal1: 'ระบบติดตามลูกค้า ว่ากำลังซื้อขายอยู่ในขั้นตอนใด',
        titleNormal2: 'ให้คุณไม่พลาดกับลูกค้าในทุกลำดับการซื้อขาย',
        titleBlue: '',
        descriptionInfo: 'จัดการรายละเอียดเชิงลึกได้ในทุกขั้นตอน ตั้งแต่ ติดตามขาย รอชำระเงิน ยืนยันชำระเงิน ส่งของ และปิดการขาย',
        cardInfo: [
          {
            image: cardInfoFCus1,
            title: 'เห็นจำนวน, สถานะลูกค้าทุกขั้นตอนการขาย',
            detail: 'ดูจำนวนลูกค้าในขั้นตอนต่างๆ ตั้งแต่ติดตามขาย-รอชำระเงิน-ยืนยันชำระเงิน-รอการส่งของ-ปิดการขาย',
          },
          {
            image: cardInfoFCus2,
            title: 'เข้าไปจัดการกับลูกค้าในแต่ละหมวดหมู่ได้',
            detail: 'เข้าไปพูดคุย และจัดการกับลูกค้าได้ในแต่ละสถานะการซื้อขาย รวมถึงเปลี่ยนแปลงข้อมูล และแจกไปยังหมวดอื่นๆได้',
          },
          {
            image: cardInfoFCus3,
            title: 'ตัดสต็อก ปริ้นท์ใบปะหน้าพัสดุ และส่งของ',
            detail: 'ปริ้นท์ใบปะหน้าพัสดุ โดยรันเลขไปรษณีย์แบบอัตโนมัติ รวมถึงตัดสต็อก และอัพเดทการขนส่งต่อลูกค้าได้',
          },
          {
            image: cardInfoFCus4,
            title: 'สรุปผลการปิดการขาย และบันทึกเป็น Excel ได้',
            detail: 'รายงานผลการซื้อขายของลูกค้าแต่ละราย และสามารถบันทึกเป็น Excel เพื่อวัดผลได้อีกทาง',
          },
        ],
      },
      toggleImageContent: {
        imageRight: toggleImage4,
        contentList: [
          {
            titleContent: 'Follow',
            detailContent: 'เข้าไปติดตามการขายลูกค้าทั้งหมด และเชื่อมกับแชทลูกค้า โดยแสดงข้อมูลของสินค้า และสถานะที่คุยกับลูกค้าไว้อยู่',
            show: true,
          },
          {
            titleContent: 'Waiting for payment',
            detailContent: 'แสดงจำนวนลูกค้าที่รอยืนยันการชำระเงิน คุณสามารถเข้าไปดูแชท และจัดการส่งข้อมูลชำระเงินได้',
            show: true,
          },
          {
            titleContent: 'Confirm payment',
            detailContent: 'แสดงจำนวนลูกค้าที่ยืนยันสั่งซื้อสินค้า พร้อมเข้าไปดูได้เป็นรายคน โดยจะเชื่อมกับระบบส่งของและตัดสต็อกต่อ',
            show: true,
          },
          {
            titleContent: 'Waiting for shipment',
            detailContent: 'แสดงจำนวนลูกค้าที่รอรับสินค้า มีข้อมูลการโอนเงิน ธนาคาร, เลข Tracking ไปรษณีย์, วันเวลาที่ส่ง เพื่อเป็นข้อมูลตอบกลับลูกค้า',
            show: true,
          },
          {
            titleContent: 'Close Sale ',
            detailContent: 'แสดงจำนวนลูกค้า ที่ปิดการขาย หรือ ได้รับสินค้าแล้วโดยเข้าไปจัดการส่งต่อลูกค้า ไปยังระบบบริการหลังการขายได้',
            show: false,
          },
        ],
      },
    },
    {
      featureTwoSide: {
        imageTitle: imageTitle5,
        title: 'Customers',
        detail: 'ศูนย์กลางเก็บรายชื่อลูกค้าทั้งหมดของร้านค้า เห็นทุกประวัติ ทุกข้อมูล',
        idTitle: 'morefeature005',
        image: image5,
      },
      featureCardInfo: {
        titleNormal1: 'รวมรายชื่อลูกค้าทั้งหมดที่มี ในร้านค้าคุณ',
        titleNormal2: 'แสดงประวัติ กิจกรรมซื้อขาย',
        titleBlue: 'อย่างละเอียด',
        descriptionInfo: 'ในฟีเจอร์นี้ คุณสามารถเข้าไปแก้ไข และอัพเดทข้อมูลลูกค้าได้ เห็นทุกรายละเอียด รวมถึงประวัติการจัดการในทุกวงจร',
        cardInfo: [
          {
            image: cardInfoCus1,
            title: 'เห็นลูกค้าครบทุกคน ไม่ต้องแยกดูทีละจุด',
            detail: 'ฟีเจอร์นี้ ออกแบบมาเพื่อให้เห็นลูกค้าทุกคนในร้านทั้งหมด ไม่ว่าจะลูกค้าที่กำลังรอพูดคุยซื้อขาย หรือที่ปิดการขายไปแล้ว',
          },
          {
            image: cardInfoCus2,
            title: 'เห็นทุกข้อมูล ทุกประเด็นของลูกค้าแต่ละคน',
            detail: 'นอกจากเห็นลูกค้าทุกคนแล้ว ก็ยังแสดงข้อมูลทุกอย่าง ไม่ว่าจะเป็นช่องทางติดต่อ สถานะ และข้อมูลการพูดคุย  เป็นต้น',
          },
          {
            image: cardInfoCus3,
            title: 'เชื่อมต่อไปยังระบบจัดการลูกค้าได้',
            detail: 'เช็คได้ว่า ลูกค้าคนนั้นอยู่ในขั้นตอนขายใด และเชื่อมต่อไปยังขั้นตอนต่างๆ เพื่อจัดการต่อได้ทันที',
          },
          {
            image: cardInfoCus4,
            title: 'เห็นประวัติการทำรายการทุกอย่าง',
            detail: 'นอกจากนั้น ยังเห็นว่าใครเป็นคนสนทนาและจัดการลูกค้า รวมถึงเห็นประวัติการทำรายการของลูกค้าทุกอย่างที่ผ่านมา',
          },
        ],
      },
      toggleImageContent: {
        imageRight: toggleImage5,
        contentList: [
          {
            titleContent: 'Information',
            detailContent: 'สามารถเข้าเปลี่ยนแปลง แก้ไข ข้อมูลของลูกค้าแต่ละคนได้ กำหนดสถานะได้ว่าลูกค้าคนนั้นมีศักยภาพเพียงใดสำหรับปิดการขาย',
            show: true,
          },
          {
            titleContent: 'Order',
            detailContent: 'เข้าไปดูข้อมูลการสั่งสินค้า เห็นข้อมูลการชำระเงิน และสถานะลูกค้า ดูได้ว่าลูกค้าว่าอยู่ในขั้นตอนไหนของการซื้อขาย เพื่อจัดการลูกค้าต่อได้ทันที',
            show: true,
          },
          {
            titleContent: 'Activity',
            detailContent: 'เห็นความเคลื่อนไหวของลูกค้า ว่าเข้ามาคอมเม้นต์ อินบ็อกกี่คน จากโพสต์ใด สินค้าใด เพื่อเข้าไปจัดการเป็นรายคน และเลือกแสดงข้อมูลย้อนหลังได้',
            show: true,
          },
          {
            titleContent: 'Log',
            detailContent: 'แสดงประวัติการจัดการ ความเคลื่อนไหวของลูกค้าทั้งหมด ไม่ว่าจะเป็นคอมเม้นต์ สินค้า ประเภทของลูกค้า โดยเลือกวันที่ดูย้อนหลังได้',
            show: true,
          },
        ],
      },
    },
    {
      featureTwoSide: {
        imageTitle: imageTitle6,
        title: 'Products',
        detail: 'ระบบสร้างสินค้า พร้อมการบริหารจัดการ ให้พร้อมขายอย่างสมบูรณ์แบบ',
        idTitle: 'morefeature006',
        image: image6,
      },
      featureCardInfo: {
        titleNormal1: 'สร้างสินค้า แชร์ให้ลูกค้า เชื่อมกับระบบสต็อก',
        titleNormal2: 'เสริมรายละเอียดสินค้า',
        titleBlue: 'ลงลึกได้ทุกมิติ',
        descriptionInfo: 'เชื่อมสินค้าไปยังแฟนเพจ และอินบ็อกซ์ และยังมีระบบแยกหมวดหมู่สินค้า ให้การขายสินค้าเป็นเรื่องที่ไม่วุ่นวาย',
        cardInfo: [
          {
            image: cardInfoProd1,
            title: 'สร้างรายการสินค้าได้ตามต้องการ',
            detail: 'สร้างรายละเอียดสินค้า รวมถึงจัดการสถานะของสินค้า เพื่อให้สะดวกต่อการจัดการ และการขาย โดยง่ายที่สุด',
          },
          {
            image: cardInfoProd2,
            title: 'จัดการสินค้าครบทุกมิติ ครบทุกรายละเอียด',
            detail: 'สามารถสร้างรายละเอียดสินค้า อย่างลงลึกได้ ไม่ว่าจะ สี ไซส์ และรายละเอียดปลีกย่อยอื่นๆ',
          },
          {
            image: cardInfoProd3,
            title: 'เชื่อมสินค้าต่างๆ ไปยังเพจ และอินบ็อกซ์',
            detail: 'มีระบบสร้างลิงค์สินค้า เพื่อโพสต์บนแฟนเพจ หรืออินบ็อกซ์ไปให้ลูกค้า เมื่อลูกค้ากดลิงค์สินค้า คุณจะรู้ได้ทันทีว่าลูกค้าสนใจสินค้าตัวใด',
          },
          {
            image: cardInfoProd4,
            title: 'เพิ่มเติม อัพเดทสินค้าในสต็อกได้ตามต้องการ',
            detail: 'คุณสามารถเพิ่มเติม แก้ไขรายละเอียดสินค้า ตัดสต็อกได้ตามจริง รวมถึงจัดการถึงสถานะสินค้าต่อได้',
          },
        ],
      },
      toggleImageContent: {
        imageRight: toggleImage6,
        contentList: [
          {
            titleContent: 'Products',
            detailContent: 'สร้างสินค้า และบริหารจัดการ ได้ตามต้องการ เพื่อเชื่อมไปยังโพสต์ และอินบ็อกซ์ ไปยังลูกค้า',
            show: true,
          },
          {
            titleContent: 'Product Attributes',
            detailContent: 'เมื่อสร้างสินค้าแล้ว ก็สามารถใส่รายละเอียดปลีกย่อยได้ ไม่ว่าจะเป็น สี ไซส์ และรายละเอียดเฉพาะเจาะจง',
            show: true,
          },
          {
            titleContent: 'Inventory & Status',
            detailContent: 'สามารถเข้าไปจัดการสต็อก สร้างรหัสสินค้าให้รันต่อแบบอัตโนมัติ และยังจัดการสถานะสินค้า ว่ากำลังขาย ยกเลิกการขาย หรือสินค้าหมด ได้',
            show: true,
          },
          {
            titleContent: 'Categories',
            detailContent: 'จัดหมวดหมู่ให้กับสินค้า ไม่ว่าจะหมวดหมู่ใหญ่ หรือย่อย ไม่สับสนด้วยระบบการกรองข้อมูล (Filter) ทำให้จัดหมวดหมู่เป็นเรื่องง่าย',
            show: true,
          },
          {
            titleContent: 'Save and Share',
            detailContent: 'สร้างลิงค์สินค้าแบบอัตโนมัติ เพื่อแชร์ไปยังแฟนเพจ หรืออินบ็อกซ์ เมื่อลูกค้ากดลิงค์ จะรู้ได้ทันว่าลูกค้าสนใจสินค้าตัวไหน',
            show: false,
          },
        ],
      },
    },
    {
      featureTwoSide: {
        imageTitle: imageTitle7,
        title: 'Purchase Orders',
        detail: 'เห็นยอดการสั่งซื้อทั้งหมด ทั้งภาพรวม รวมถึงยอดในแต่ละขั้นตอนการขาย',
        idTitle: 'morefeature007',
        image: image7,
      },
      featureCardInfo: {
        titleNormal1: 'สรุปยอดการซื้อขาย ในทุกขั้นตอน จากลูกค้าทุกราย',
        titleNormal2: 'ให้การจัดการ และการคำนวณ เป็นเรื่องสบายๆ',
        titleBlue: '',
        descriptionInfo: 'อัพเดทการซื้อขายทุกขั้นตอนตามเวลาจริง ดูออร์เดอร์ โดยสามารถเชื่อมไปพูดคุย และจัดการกับลูกค้าได้ในทุกขั้นตอน',
        cardInfo: [
          {
            image: cardInfoPOD1,
            title: 'เห็นยอดทั้งหมดทุกขั้นตอน ไม่ต้องแยกดู',
            detail: 'เห็นยอดตั้งแต่ขั้นตอนติดตามขาย ยอดรอยืนยันชำระเงิน ยอดชำระจริง ยอดที่อยู่ในขั้นตอนส่งของ และยอดปิดการขาย',
          },
          {
            image: cardInfoPOD2,
            title: 'อัพเดทการซื้อขายในทุกขั้นตอนตามเวลาจริง',
            detail: 'อัพเดทโดยเรียงตามลูกค้าที่เข้ามาในเวลาล่าสุด รวมถึงเห็นข้อมูล ว่าลูกค้าว่าอยู่ในขั้นตอนไหนของการซื้อขาย',
          },
          {
            image: cardInfoPOD3,
            title: 'ดูประวัติการซื้อขายที่ผ่านมาของลูกค้าทุกคน',
            detail: 'เข้าดูประวัติการซื้อขายของลูกค้าแต่ละรายได้แบบละเอียด เพื่อจัดการข้อมูล และสถานะของลูกค้ารายนั้น ให้เป็นข้อมูลในระบบ',
          },
          {
            image: cardInfoPOD4,
            title: 'ระบบคืนเงินลูกค้า Refund ได้สะดวก',
            detail: 'มีระบบคืนเงินลูกค้า ที่ออกแบบมาให้พร้อมกับสถานการณ์ซื้อขายที่เป็นไปได้ทุกรูปแบบ',
          },
        ],
      },
      toggleImageContent: {
        imageRight: toggleImage7,
        contentList: [
          {
            titleContent: 'Order',
            detailContent: 'คุณจะเห็นยอดรวมของการสั่งซื้อทั้งหมด เรียงตามเวลาจริง และยังเห็นยอดที่แบ่งออกเป็นหมวดหมู่ ในทุกขั้นตอนการซื้อขาย',
            show: true,
          },
          {
            titleContent: 'Refund/Return',
            detailContent: 'มีระบบคืนเงินให้กับลูกค้า ในกรณีเกิดปัญหาการซื้อขาย โดยข้อมูลการคืนเงินจะถูกบันทึกไว้ในระบบ',
            show: true,
          },
          {
            titleContent: 'Details > Follow',
            detailContent: 'คุณสามารถดูรายละเอียดลูกค้าแต่ละคนได้ในเมนู Detail ซึ่งจะเชื่อมไปยังระบบ Follow Customer เพื่อเชื่อมกับแต่ละขั้นตอนซื้อขายได้',
            show: true,
          },
          {
            titleContent: 'Reject/Expire (ตั้งค่าใน Setting)',
            detailContent: 'คุณจะเห็นลูกค้าที่คุณปฏิเสธในระบบการซื้อขาย และลูกค้าที่หมดอายุ เพราะขาดการตอบกลับ โดยเราตั้งค่าเวลาหมดอายุได้ของลูกค้าได้',
            show: true,
          },
          {
            titleContent: 'All Step Order',
            detailContent: 'แสดงออร์เดอร์ทั้งหมด รวมถึงเห็นออร์เดอร์ของทุกขั้นตอนซื้อขาย ว่ามียอดเท่าไร และสามารถคลิกเข้าไปจัดการแต่ละขั้นตอนได้',
            show: false,
          },
        ],
      },
    },
    {
      featureTwoSide: {
        imageTitle: imageTitle8,
        title: 'Settings',
        detail: 'ระบบตั้งค่าร้านค้า ที่ครบถ้วน ให้ร้านค้าออนไลน์ สมบูรณ์แบบ ในทุกรายละเอียด',
        idTitle: 'morefeature008',
        image: image8,
      },
      featureCardInfo: {
        titleNormal1: 'ตั้งค่าร้านค้าให้สมบูรณ์แบบ ในทุกรายละเอียด',
        titleNormal2: 'ให้ร้านค้า ',
        titleBlue: 'เต็มเปี่ยมไปด้วยศักยภาพ',
        descriptionInfo: 'ไม่ว่าจะเป็นระบบชำระเงิน ขนส่ง ภาษี แอดมิน เพื่อจัดเก็บทุกข้อมูลในที่เดียว ให้ใช้ประโยชน์ต่อในทุกการขาย',
        cardInfo: [
          {
            image: cardInfoSet1,
            title: 'กำหนดแฟนเพจที่จะเชื่อมต่อกับเฟซบุ๊ก',
            detail: 'ตั้งค่าแฟนเพจที่จะเชื่อมต่อกับระบบ More-Commerce โดยเลือกแฟนเพจของคุณที่ต้องการดำเนินการ',
          },
          {
            image: cardInfoSet2,
            title: 'ตั้งค่าระบบชำระเงิน หลากหลายรูปแบบ',
            detail: 'ตั้งค่าชำระเงินได้ครบวงจร ตั้งแต่การโอนเงินในทุกธนาคาร การเก็บเงินปลายทาง, QR Code ธนาคาร, Paypal หรือ Omise เป็นต้น',
          },
          {
            image: cardInfoSet3,
            title: 'ตั้งค่าการขนส่ง พัสดุ ไปรษณีย์',
            detail: 'กำหนด แก้ไข เพิ่มเติมตัวแทน หรือองค์กรที่ใช้ในการขนส่ง เลือกวิธีการจัดส่ง และกำหนดค่าจัดส่งได้ตามต้องการ',
          },
          {
            image: cardInfoSet4,
            title: 'ตั้งค่าระดับแอดมิน สำหรับจัดการร้าน',
            detail: 'บริหารแอดมินในการจัดการร้าน ให้จัดการได้เป็นทีม โดยเลือกให้ทีมงานเป็นทั้งแอดมิน หรือสต๊าฟก็ได้',
          },
        ],
      },
      toggleImageContent: {
        imageRight: toggleImage8,
        contentList: [
          {
            titleContent: 'Shop Owner',
            detailContent: 'ตั้งค่าร้านค้า ข้อมูลที่จำเป็นทั้งหมดไม่ว่าจะเป็นไอดีไลน์ เฟซบุ๊ก อีเมล ที่อยู่ เป็นต้น',
            show: true,
          },
          {
            titleContent: 'Payment',
            detailContent: 'เพิ่มเติม แก้ไข ระบบชำระเงิน เลือกข้อมูลการโอน, QR Code หรือจะเชื่อมกับ Paypal, Omise, Pay Solution ก็ได้',
            show: true,
          },
          {
            titleContent: 'Logistic',
            detailContent: 'กำหนดรูปแบบการจัดส่ง ตั้งค่าตัวแทนขนส่งต่างๆ กำหนดเรทราคาขนส่ง ให้เหมาะกับธุรกิจคุณ',
            show: true,
          },
          {
            titleContent: 'Tax',
            detailContent: 'ตั้งค่าการชำระภาษีของสินค้า และข้อมูลจะปรากฏในใบเสร็จลูกค้า',
            show: true,
          },
          {
            titleContent: 'Order',
            detailContent: 'กำหนดการรันเลขออร์เดอร์ และกำหนดวันหมดอายุของออร์เดอร์ในกรณีไม่มีการชำระเงินเข้ามา',
            show: false,
          },
          {
            titleContent: 'Advanced Setting',
            detailContent: 'ตั้งค่าข้อความที่จะใช้ตอบกลับลูกค้าอัตโนมัติ โดยกำหนดหัวข้อ ไอคอน และข้อความตอบกลับอัตโนมัติเองได้',
            show: false,
          },
          {
            titleContent: 'Owner/Admin/Member',
            detailContent: 'เพิ่มคนจัดการร้าน โดยแอดมินจะจัดการตั้งค่าได้ สต๊าฟสามารถตอบลูกค้าได้ เปลี่ยนแปลงการตั้งค่าไม่ได้',
            show: false,
          },
          {
            titleContent: 'Log',
            detailContent: 'แสดงความเคลื่อนไหวของแอดมิน และสต๊าฟว่าได้บริหารจัดการอะไรไปบ้างในร้านค้า ให้รู้ทุกการจัดการของทีม',
            show: false,
          },
        ],
      },
    },
  ];

  return (
    <>
      <Header />
      <div className={styles.mainPageContainer}>
        <div className={styles.mainPageTopMenu}>
          <Navbar mainPage={mainPage} isFeaturesPage={isFeaturesPage} />
        </div>
        <div className={`${styles.feature100percent} ${styles.isFirstComponent}`}>
          <div className={styles.featuresContainer}>
            <FeaturesComponent FeatureData={FeatureData[0]} />
          </div>
        </div>
        <div className={styles.feature100percent}>
          <div className={styles.featuresContainer}>
            <FeaturesComponent FeatureData={FeatureData[1]} />
          </div>
        </div>
        <div className={styles.feature100percent}>
          <div className={styles.featuresContainer}>
            <FeaturesComponent FeatureData={FeatureData[2]} />
          </div>
        </div>
        <div className={styles.feature100percent}>
          <div className={styles.featuresContainer}>
            <FeaturesComponent FeatureData={FeatureData[3]} />
          </div>
        </div>
        <div className={styles.feature100percent}>
          <div className={styles.featuresContainer}>
            <FeaturesComponent FeatureData={FeatureData[4]} />
          </div>
        </div>
        <div className={styles.feature100percent}>
          <div className={styles.featuresContainer}>
            <FeaturesComponent FeatureData={FeatureData[5]} />
          </div>
        </div>
        <div className={styles.feature100percent}>
          <div className={styles.featuresContainer}>
            <FeaturesComponent FeatureData={FeatureData[6]} />
          </div>
        </div>
        <div className={styles.feature100percent}>
          <div className={styles.featuresContainer}>
            <FeaturesComponent FeatureData={FeatureData[7]} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
export default Index;
