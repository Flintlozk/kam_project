import React from 'react';
import Image from 'next/image';
import styles from './footer.module.scss';

export const Index = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.flexContainer}>
        <div className={styles.footerUpper}>
          <div className={styles.imgeLogoContainer}>
            <Image alt={'footer-MoreLogoPrimary'} width="190" height="66" src="/images/MoreLogoPrimary.svg" />
          </div>
          <div className={styles.groupContentFooter}>
            <div className={styles.content01}>More-Commerce</div>
            <div className={styles.content02}>Powered by AUTODIGI</div>
            <div className={styles.content03}>
              Call Center <a href="tel:02-029-1288">02 029 1288</a>
            </div>
          </div>
          <div className={styles.rightSocialFooter}>
            <a href={'https://m.me/morecommerceth'} target={'_blank'} rel="noopener noreferrer">
              <Image src="/images/ICON-Messenger.svg" width="33" height="33" alt={'ICON-Messenger'} className={styles.facebookFooter} />
            </a>
            <a href={'https://www.facebook.com/morecommerceth'} target={'_blank'} rel="noopener noreferrer">
              <Image src="/images/ICON-Facebook.svg" alt={'ICON-Facebook'} width="33" height="33" className={styles.facebookFooter} />
            </a>
            <a href={'https://line.me/R/ti/p/@morecommerce'} target={'_blank'} rel="noopener noreferrer">
              <Image src="/images/Line-Icon.svg" alt={'Line-Icon'} width="50" height="35" className={styles.lineFooter} />
            </a>
            <a href="https://www.youtube.com/channel/UCj5beghL7fnpfcMkhGqkS4w" target={'_blank'} rel="noopener noreferrer">
              <Image src="/images/ICON-Youtube.svg" alt={'ICON-Youtube'} width="33" height="33" className={styles.youtubeFooter} />
            </a>
            <a href={'mailto:support@more-commerce.com?subject=Please type your topic...'} rel="noopener noreferrer" target="_blank">
              <Image src="/images/ICON-Email.svg" alt={'ICON-Email'} width="33" height="33" className={styles.emailFooter} />
            </a>
            {/* <a href={'https://m.me/morecommerceth'} target={'_blank'} rel="noopener noreferrer">
              <Image src="/images/ICON-Messenger.svg" alt={'ICON-Messenger'} width="33" height="33" className={styles.facebookFooter} />
            </a>
            <a href={'https://www.facebook.com/morecommerceth'} target={'_blank'} rel="noopener noreferrer">
              <Image src="/images/ICON-Facebook.svg" alt={'ICON-Facebook'} width="33" height="33" className={styles.facebookFooter} />
            </a>
            <a href={'https://line.me/R/ti/p/@morecommerce'} target={'_blank'} rel="noopener noreferrer">
              <Image src="/images/Line-Icon.svg" alt={'Line-Icon'} width="50" height="35" className={styles.lineFooter} />
            </a>
            <a href="https://www.youtube.com/channel/UCj5beghL7fnpfcMkhGqkS4w" target={'_blank'} rel="noopener noreferrer">
              <Image src="/images/ICON-Youtube.svg" alt={'ICON-Youtube'} width="33" height="33" className={styles.youtubeFooter} />
            </a>
            <a href={'mailto:support@more-commerce.com?subject=Please type your topic...'} rel="noopener noreferrer" target="_blank">
              <Image src="/images/ICON-Email.svg" alt={'ICON-Email'} width="33" height="33" className={styles.emailFooter} />
            </a> */}
          </div>
        </div>
        <div className={styles.borderLine}></div>
        <div className={styles.footerLower}>
          <div className={styles.leftLowerSide}>
            <div className={styles.copyRight}>
              <span>Copyright </span>© 2020 More — Commerce, Inc. All rights reserved
            </div>
            <div className={styles.weUseCookie}>
              We use Cookies.{' '}
              <a href={'https://www.itopplus.com/cookie-privacy-page'} target={'_blank'} rel="noopener noreferrer">
                Click to learn more
              </a>
            </div>
          </div>
          <div className={styles.centerLowerSide}>
            <span className={styles.termServicePage}>
              <a href={'https://www.itopplus.com/condition-page'} target={'_blank'} rel="noopener noreferrer">
                Terms of Services
              </a>
            </span>{' '}
            |{' '}
            <span className={styles.policyPage}>
              <a href={'https://www.itopplus.com/cookie-privacy-page'} target={'_blank'} rel="noopener noreferrer">
                Privacy Policy
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;
