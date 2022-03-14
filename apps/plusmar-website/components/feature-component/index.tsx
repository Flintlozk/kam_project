import React from 'react';
import Image from 'next/image';
import styles from './feature-component.module.scss';

interface FeatureTwoSideInterface {
  imageTitle: StaticImageData;
  title: string;
  detail: string;
  idTitle: string;
  image: StaticImageData;
}

interface CardInfoInterface {
  image: StaticImageData;
  title: string;
  detail: string;
}

interface FeatureCardInfoInterface {
  titleNormal1: string;
  titleNormal2: string;
  titleBlue: string;
  descriptionInfo: string;
  cardInfo: Array<CardInfoInterface>;
}

interface ContentListInterface {
  titleContent: string;
  detailContent: string;
  show: boolean;
}

interface ToggleImageContentInterface {
  imageRight: StaticImageData;
  contentList: Array<ContentListInterface>;
}

interface PropsInterface {
  featureTwoSide: FeatureTwoSideInterface;
  featureCardInfo: FeatureCardInfoInterface;
  toggleImageContent: ToggleImageContentInterface;
}

export const Index = (data: { FeatureData: PropsInterface }) => {
  const [showContent, setShowContent] = React.useState(styles.hideListContainer);
  const [isShowContent, setIsShowContent] = React.useState(false);
  const [More, setMore] = React.useState('More');
  const [ArrowMore, setArrowMore] = React.useState(
    <Image className={styles.normalImage} alt={'Arrow-Down_Blue'} width={15} height={15} src={'/images/pricingPage/Arrow-Down_Blue.svg'} />,
  );
  const [MoreButtom, setMoreButtom] = React.useState(styles.activeMore);

  React.useEffect(() => {
    if (data.FeatureData.toggleImageContent.contentList.length === 4) {
      setMoreButtom(styles.unactiveMore);
    }
  });

  const animateScroll = (element) => {
    // event.preventDefault();
    window.scroll({
      behavior: 'smooth',
      left: 0,
      top: element.offsetTop,
    });
    // window.scrollTo(0, 3000);
  };

  const generateID = (title: string) => {
    return '#' + title;
  };

  const toggleShowContent = () => {
    if (isShowContent) {
      setShowContent(styles.hideListContainer);
      setIsShowContent(false);
      setMore('More');
      setArrowMore(<Image className={styles.normalImage} alt={'Arrow-Down_Blue'} width={20} height={20} src={'/images/pricingPage/Arrow-Down_Blue.svg'} />);
    } else {
      setShowContent(styles.showListContainer);
      setIsShowContent(true);
      setMore('Less');
      setArrowMore(<Image className="normalImage rotate" alt={'Arrow-Down_Blue'} width={20} height={20} src={'/images/pricingPage/Arrow-Down_Blue.svg'} />);
    }
  };

  return (
    <>
      <div id={'moreMenu' + data.FeatureData.featureTwoSide.idTitle} className={styles.featureTwoSide}>
        <div className={styles.featureLeft}>
          <div className={styles.imageTitle}>
            <Image src={data.FeatureData.featureTwoSide.imageTitle} alt={'imageTitle'} />
          </div>
          <div className={styles.titleLeft}>{data.FeatureData.featureTwoSide.title}</div>
          <div className={styles.detailLeft}>{data.FeatureData.featureTwoSide.detail}</div>
          <div className={styles.learnMoreButtom}>
            <a
              href={generateID(data.FeatureData.featureTwoSide.idTitle)}
              onClick={(e) => {
                animateScroll(document.getElementById(data.FeatureData.featureTwoSide.idTitle));
              }}
            >
              Learn More <Image className={styles.normalImage} src={'/images/pricingPage/Arrow-Down_Blue.svg'} width={15} height={15} alt={'Arrow-Down_Blue'} />
            </a>
          </div>
        </div>
        <div className={styles.featureRight}>
          <Image src={data.FeatureData.featureTwoSide.image} alt={'featureTwoSide'} />
        </div>
      </div>
      <div className={styles.featureCardInfo}>
        <div id={data.FeatureData.featureTwoSide.idTitle} className={styles.titleInfoHeader}>
          <div className={styles.titleInfoNomal}>{data.FeatureData.featureCardInfo.titleNormal1}</div>
          <div className={styles.titleInfoNomal}>
            {data.FeatureData.featureCardInfo.titleNormal2}
            <span className={styles.titleInfoBlue}>{data.FeatureData.featureCardInfo.titleBlue}</span>
          </div>
        </div>
        <div className={styles.descriptionInfo}>{data.FeatureData.featureCardInfo.descriptionInfo}</div>
        <div className={styles.cardInfoContainer}>
          {data.FeatureData.featureCardInfo.cardInfo.map((info, index) => (
            <div key={index} className={styles.CardBlock}>
              <div className={styles.CardInfo}>
                <div className={styles.cardImage}>
                  <Image alt={'cardImage' + index} src={info.image} />
                </div>
                <div className={styles.cardTitle}>{info.title}</div>
                <div className={styles.cardDetail}>{info.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.toggleImageContent}>
        <div className={styles.toggleContentContainer}>
          <div className={styles.imageLeftSide}>
            <div className={styles.imageBox}>
              <Image alt={'imageRight'} src={data.FeatureData.toggleImageContent.imageRight} />
            </div>
          </div>
          <div className={styles.gapInfo}></div>
          <div className={styles.contentRightSide}>
            {data.FeatureData.toggleImageContent.contentList.map(
              (toggleData, index) =>
                (toggleData.show && (
                  <div key={index} className={styles.contentListContainer}>
                    <div className={styles.titleContentHeader}>
                      <Image alt={'Mini-Dash'} width={15} height={15} src={'/images/pricingPage/Mini-Dash.svg'} />
                      <span className={styles.titleContent}>{toggleData.titleContent}</span>
                    </div>
                    <div className={styles.detailContent}>{toggleData.detailContent}</div>
                  </div>
                )) ||
                (!toggleData.show && (
                  <div key={index} className={`${styles.contentListContainer} ${showContent}`}>
                    <div className={styles.titleContentHeader}>
                      <Image alt={'Mini-Dash'} width={15} height={15} src={'/images/pricingPage/Mini-Dash.svg'} />
                      <span className={styles.titleContent}>{toggleData.titleContent}</span>
                    </div>
                    <div className={styles.detailContent}>{toggleData.detailContent}</div>
                  </div>
                )),
            )}
            <div
              className={`${styles.moreButtom} ${MoreButtom}`}
              onClick={() => {
                toggleShowContent();
              }}
            >
              {More} {ArrowMore}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Index;
