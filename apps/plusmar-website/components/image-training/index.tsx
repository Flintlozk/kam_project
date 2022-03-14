import React, { useState } from 'react';
import Image from 'next/image';
import styles from './image-training.module.scss';

import WORKSHOP01 from '../../public/images/pricingPage/WORKSHOP01.png';
import WORKSHOP02 from '../../public/images/pricingPage/WORKSHOP02.png';
import WORKSHOP03 from '../../public/images/pricingPage/WORKSHOP03.png';
import WORKSHOP04 from '../../public/images/pricingPage/WORKSHOP04.png';
import WORKSHOP05 from '../../public/images/pricingPage/WORKSHOP05.png';
import WORKSHOP06 from '../../public/images/pricingPage/WORKSHOP06.png';
import WORKSHOP07 from '../../public/images/pricingPage/WORKSHOP07.png';
import WORKSHOP08 from '../../public/images/pricingPage/WORKSHOP08.png';

export const Index = () => {
  const imageTraining = [
    {
      imagePath: WORKSHOP01,
    },
    {
      imagePath: WORKSHOP02,
    },
    {
      imagePath: WORKSHOP03,
    },
    {
      imagePath: WORKSHOP04,
    },
    {
      imagePath: WORKSHOP05,
    },
    {
      imagePath: WORKSHOP06,
    },
    {
      imagePath: WORKSHOP07,
    },
    {
      imagePath: WORKSHOP08,
    },
  ];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.innerContainer}>
        <div className={styles.titleText}>Customer Training & Workshop</div>
        <div className={styles.descriptText}>ภาพบรรยากาศการอบรม และเวิร์คช็อปการใช้งานแพลตฟอร์ม</div>
        <div className={styles.flexContainer}>
          {imageTraining.map((info, index) => (
            <div className={styles.workshopImage} key={index}>
              <Image alt={'WorkshopTraining' + index} src={info.imagePath} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Index;
