import React from 'react';
import Image from 'next/image';
import styles from './contact.module.scss';

import Header from '../../components/header';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import GoogleMap01 from '../../public/images/contactPage/GoogleMap01.png';

// import ContactForm from '../../components/more-commerce-contact';
interface PropsInterface {
  mainPage?: boolean;
  isFeaturesPage?: boolean;
}
export const Index = ({ mainPage, isFeaturesPage }: PropsInterface) => {
  mainPage = false;
  isFeaturesPage = false;

  const itpGoogleMap =
    // eslint-disable-next-line max-len
    'https://www.google.co.th/maps/place/ITOPPLUS+Co.,Ltd./@13.7645013,100.5658688,17z/data=!3m1!4b1!4m5!3m4!1s0x30e29e0188af3ac7:0xf043fa7f14cda5bd!8m2!3d13.7645013!4d100.5680575?hl=th';

  return (
    <>
      <Header />
      <div className={styles.mainPageContainer}>
        <div className={styles.mainPageTopMenu}>
          <Navbar mainPage={mainPage} isFeaturesPage={isFeaturesPage} />
        </div>
        <div className={styles.contactContainer}>
          <div className={styles.contactPageTitle}>Contact</div>
          <div className={styles.boxContainer}>
            <div className={styles.leftContainer}>
              <div className={styles.telBlock}>
                <Image className={styles.normalImage} alt={'CallSymbol'} width={20} height={20} src="/images/contactPage/Call.svg" />
                <a href="tel:02-029-1234"> 02-029-1234 (Sales)</a>, <a href="tel:02-029-1288">02-029-1288 (Customer Service)</a>
              </div>
              <div className={styles.emailBlock}>
                <Image className={styles.normalImage} alt={'EmailSymbol'} width={20} height={20} src="/images/contactPage/Email.svg" />
                <a href="mailto:support@more-commerce.com"> support@more-commerce.com</a>
              </div>
              <div className={styles.addressBlock}>
                <div className={styles.addressTitle}>
                  <Image className={styles.normalImage} alt={'placeholderSymbol'} width={25} height={25} src="/images/contactPage/placeholder.svg" />
                  <span> AUTODIGI Co.,Ltd. (Head Office)</span>
                </div>
                <div className={styles.addressDescription}>89 AIA Capital Center Building, 32nd Floor, Unit 3204-3207, Ratchadapisek Road, Din Daeng, Bangkok 10400</div>
              </div>
            </div>
            <div className={styles.rightContainer}>
              {/* <ContactForm /> */}
              <div className={styles.mapBlock}>
                <a href={itpGoogleMap} target={'_blank'} rel="noopener noreferrer">
                  <Image src={GoogleMap01} alt={'mapToItopplus'} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
export default Index;
