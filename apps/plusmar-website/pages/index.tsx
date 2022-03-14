import React from 'react';
// import ModalVideo from 'react-modal-video';
import Image from 'next/image';
import styles from './index.module.scss';

import Header from '../components/header';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import MoreCommerceFeature from '../components/more-commerce-feature';
import MoreCommerceSwitchContent from '../components/more-commerce-switch-content';

import BANNER_TOP01_optimized from '../public/images/BANNER_TOP01_optimized.png';
import ImageVideo1 from '../public/images/FEATURE01_optimized.png';
import ImageVideo2 from '../public/images/VIDEO_M.png';
import Highlight_Admin_optimized from '../public/images/Highlight_Admin_optimized.png';
import Highlight_Customer_optimized from '../public/images/Highlight_Customer_optimized.png';

interface PropsInterface {
  mainPage?: boolean;
  isFeaturesPage?: boolean;
}

export const Index = ({ mainPage, isFeaturesPage }: PropsInterface) => {
  mainPage = true;
  isFeaturesPage = false;
  const [homeBannerDescription, setHomeBannerDescription] = React.useState('แพลตฟอร์มบริหารจัดการอินบอกซ์ สั่งซื้อ โอนเงิน จัดส่ง ปิดการขายบนแชทได้ทันที');
  const [titleFollowStatus1, setTitleFollowStatus1] = React.useState('แพลตฟอร์มบริหารจัดการรายชื่อลูกค้า — ');
  const [titleFollowStatus2, setTitleFollowStatus2] = React.useState('รายชื่อไม่หาย แบ่งสถานะให้ง่ายต่อการติดตาม');

  const [homeBannerHeader1, setHomeBannerHeader1] = React.useState('แพลตฟอร์มบริหารลูกค้าในอินบ็อกซ์ ปิดการขาย');
  const [homeBannerHeader2, setHomeBannerHeader2] = React.useState('เก็บรายชื่อ สั่งซื้อ โอนเงิน จัดส่งได้ทันที');

  const [isOpenVideo, setIsOpenVideo] = React.useState(false);

  const [title11, setTitle11] = React.useState('เข้าถึงสินค้าของคุณผ่านช่องทางแชท');
  const [title12, setTitle12] = React.useState('สั่งซื้อง่าย ปิดการขายได้ทันที');
  const [title13, setTitle13] = React.useState(' ในช่องทางเดียว');

  const [title21, setTitle21] = React.useState('จัดการชื่อและสถานะของลูกค้าโดย ');
  const [title22, setTitle22] = React.useState(' กับระบบที่ทำให้คุณ ');
  const [title23, setTitle23] = React.useState('ไม่พลาดทุกรายชื่อลูกค้า');

  const [descriptionContent, setDescriptionContent] = React.useState('แชทไม่หาย รายชื่อลูกค้าไม่ตกหล่น ติดตามขายได้ครบพร้อมเก็บประวัติลูกค้าทั้งหมด เริ่มต้นใช้งานได้เลยวันนี้');

  const [ImageVideo, setImageVideo] = React.useState(ImageVideo1);
  React.useEffect(() => {
    if (window.innerWidth <= 766) {
      setHomeBannerDescription('แพลตฟอร์มบริหารจัดการอินบอกซ์ ซื้อ จ่าย จัดส่ง ปิดการขายได้ทันที');
      setTitleFollowStatus1('แพลตฟอร์มบริหารจัดการรายชื่อลูกค้า ไม่ตกหล่น — ');
      setTitleFollowStatus2('ติดตามผลได้ตรงสถานะ');
      setImageVideo(ImageVideo2);
      setHomeBannerHeader1('แพลตฟอร์มบริหารลูกค้าในอินบ็อกซ์');
      setHomeBannerHeader2('ปิดการขายได้ทันที');
      setTitle11('ซื้อสินค้าผ่านแชท');
      setTitle12('ปิดการขาย');
      setTitle21('จัดการลูกค้าโดย');
      setTitle22('ที่จะทำให้คุณ ');
      setTitle23('เก็บลูกค้าได้ครบ');
      setDescriptionContent('แชทไม่หาย รายชื่อลูกค้าไม่ตกหล่น ติดตามขายได้ครบ');
    }
  });

  const openModal = () => {
    setIsOpenVideo(true);
  };

  return (
    <>
      <Header />
      <div className={styles.mainPageContainer}>
        <div className={styles.mainPageTopMenu}>
          <Navbar mainPage={mainPage} isFeaturesPage={isFeaturesPage} />
        </div>
        <div className={styles.homePageMainClass}>
          <div className={styles.homePageBanner}>
            <div className={styles.homeBannerHeader1}>More — Commerce</div>
            <div className={styles.homeBannerHeader2}>{homeBannerHeader1}</div>
            <div className={styles.homeBannerHeader2}>{homeBannerHeader2}</div>
            <div className={styles.homeBannerDescription}></div>
            <a href="https://app.more-commerce.com/login">
              <button className={styles.bannerButtonGetStart}>
                Get Started <Image className={styles.imageArrow} alt={'ICON-Arrow'} width="20px" height="20px" src="/images/ICON-Arrow.svg" />
              </button>
            </a>
            <div className={styles.videoMoreCommerce}>
              <video controls>
                <source src="/asset/MoreCommerceVideoFinal.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
        <div className={styles.titleStatusContainer}>
          <div className={styles.titleFollowStatus}>
            <div>{titleFollowStatus1}</div>
            <div>{titleFollowStatus2}</div>
          </div>
          <div className={styles.titleFollowStatusDes}>บริหารจัดการอินบอกซ์ แชท ไลฟ์ ทุกอย่างรวมไว้ที่เดียว</div>
        </div>
        <MoreCommerceFeature />
        <div className={styles.contentTwosideContainer}>
          <div className={styles.mainContentTwoside}>
            <div className={styles.leftSideContent}>
              <div onClick={openModal} className={styles.videoContainer}>
                <div className={styles.videoLogo}>
                  <Image src={ImageVideo} alt={'ImageVideo'} />
                </div>
              </div>
            </div>
            <div className={styles.gapContent}></div>
            <div className={styles.rightSideContent}>
              <div className={styles.titleContent}>ง่าย สะดวก รวดเร็ว —</div>
              <div className={styles.titleContent}>ในการจัดการรายชื่อลูกค้า</div>
              <div className={styles.titleContent}>และทุกการซื้อขายสินค้า</div>
              <div className={styles.descriptionContent}>จัดการออเดอร์ จัดกลุ่มคำสั่งซื้ออย่างเป็นระบบ จัดการรายละเอียด สินค้า ราคา ค่าจัดส่ง</div>
            </div>
          </div>
        </div>
        <div className={styles.leftrightContainer}>
          <div className={styles.titleContent}>
            สร้างประสบการณ์ใหม่ในการ <span>จัดการธุรกิจ</span>
          </div>
          <div className={styles.flexContainer}>
            <div className={styles.leftContent}>
              <Image className={styles.imgLeft} src={Highlight_Customer_optimized} />
              <div className={styles.textLeftside}>
                <span className={styles.boldTitle}>ลูกค้า </span>
                <span className={styles.normalTitle}>{title11}</span>
                <div className={styles.normalTitle}>
                  <span>{title12}</span> <span className={styles.blueTitle}>{title13}</span>
                </div>
              </div>
            </div>
            <div className={styles.rightContent}>
              <Image className={styles.imgRight} src={Highlight_Admin_optimized} />
              <div className={styles.textRightside}>
                <div>
                  <span className={styles.normalTitle}>{title21}</span>
                  <span className={styles.boldTitle}>แอดมิน</span>
                </div>
                <span className={styles.normalTitle}>{title22}</span>
                <span className={styles.blueTitle}>{title23}</span>
              </div>
            </div>
          </div>
        </div>
        <MoreCommerceSwitchContent />
        <div className={styles.mainContactContainer}>
          <div className={styles.mainFlexContainer}>
            <div className={styles.titleContent}>บริหารจัดการลูกค้าทั้งหมดของธุรกิจคุณ</div>
            <div className={styles.titleContent}>ครบทุกขั้นตอนการขายในแพลตฟอร์มเดียว</div>
            <div className={styles.descriptionContent}>{descriptionContent}</div>
            <a href="https://app.more-commerce.com/login">
              <button className={styles.bannerButtonGetStart}>
                Get Started
                <Image className={styles.imageArrow} alt={'ICON-Arrow'} width={20} height={20} src="/images/ICON-Arrow.svg" />
              </button>
            </a>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Index;
