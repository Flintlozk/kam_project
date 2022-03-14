import React from 'react';
import Image from 'next/image';
import styles from './card-feature.module.scss';

interface PropsInterface {
  propsData: {
    imagePath: StaticImageData;
    title: string;
    subtitle: string;
    description: string;
    news: boolean;
    newWord: string;
    newsColorWord: string;
  };
}
interface KeyInterface {
  key: number;
}
export const Index = ({ propsData }: PropsInterface, { key }: KeyInterface) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageDiv}>
        <Image alt={'cardImage' + key} src={propsData.imagePath} />
      </div>
      <div className={styles.titleDiv}>
        {propsData.title}
        {propsData.news && (
          <span className={styles.newsDiv} style={{ backgroundColor: propsData.newsColorWord }}>
            {propsData.newWord}
          </span>
        )}
      </div>
      <div className={styles.subTitleDiv}>{propsData.subtitle}</div>
      <div className={styles.detailDiv}>{propsData.description}</div>
    </div>
  );
};

export default Index;
