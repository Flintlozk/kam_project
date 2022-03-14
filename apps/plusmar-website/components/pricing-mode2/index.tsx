import React from 'react';
import styles from './pricing-mode2.module.scss';
import Link from 'next/link';
import Image from 'next/image';

import Arrow_Purple from '../../public/images/Arrow-Purple.svg';
import ICON_Arrow from '../../public/images/ICON-Arrow.svg';
interface SubDescriptionArray {
  name: any;
  value: any;
}

interface PropsInterface {
  title: string;
  price: any;
  type: number;
  description: string;
  button: any;
  infomationData: Array<SubDescriptionArray>;
}

interface PropsInterfaces {
  propsData: Array<PropsInterface>;
}

export const Index = (data: PropsInterfaces) => {
  const chooseTypeClass = (type: number) => {
    switch (type) {
      case 1:
        return styles.freeType;
      case 2:
        return styles.businessType;
      case 3:
        return styles.commerceType;
    }
  };

  const chooseArrowClass = (type: number) => {
    switch (type) {
      case 1:
        return styles.cardFooterContainer1;
      case 2:
        return styles.cardFooterContainer2;
      case 3:
        return styles.cardFooterContainer3;
    }
  };

  return (
    <div className={styles.pricingModeContainer}>
      <div className={styles.priceModeCard}>
        {data.propsData.map((info, index) => (
          <div key={index} className={styles.priceCardBorder}>
            <div className={chooseTypeClass(info.type)}>
              <div className={styles.priceTitle}>{info.title}</div>
              <div className={styles.pricePrice}>{info.price}</div>
              <div className={styles.priceDescription}>{info.description}</div>
              <a href="https://app.more-commerce.com/login">
                <div className={styles.priceButton}>{info.button}</div>
              </a>
              <div className={styles.priceInfo}>
                {info.infomationData.map((infoInside, index2) => (
                  <div key={index2} className={styles.infoList}>
                    <div className={styles.nameInfo}>{infoInside.name}</div>
                    <div className={styles.valueInfo}>{infoInside.value}</div>
                  </div>
                ))}
              </div>
            </div>
            {info.type !== 1 && (
              <Link href="/contact">
                <a href="">
                  <div className={styles.cardFooter}>
                    <div className={styles.cardFooterContainer}>
                      <div className={chooseArrowClass(info.type)}>
                        <div className={styles.cardFooterLeft}>
                          <div className={styles.cardFooterText1}>เพิ่ม Facebook Page หรือ LINE OA</div>
                          <div className={styles.cardFooterText2}>
                            พิเศษ! ลดราคาทันที <span className={styles.percentNumber}>20%</span> คลิก
                          </div>
                        </div>
                        <div className={styles.cardFooterRight}>
                          <div className={styles.cardFooterArrow}>
                            {info.type === 2 && <Image className={styles.imageArrow} alt={'ICON-Arrow'} width={20} height={20} src={Arrow_Purple} />}
                            {info.type === 3 && <Image className={styles.imageArrow} alt={'ICON-Arrow'} width={20} height={20} src={ICON_Arrow} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
