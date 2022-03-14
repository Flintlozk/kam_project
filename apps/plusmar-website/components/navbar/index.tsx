import React, { useEffect, useState } from 'react';
import Router from 'next/router';
// import { Link } from 'react-router';
import Image from 'next/image';
import styles from './navbar.module.scss';
// import logoPath1 from '/images/More-Logo-White.svg';
// import More_Logo_White from '';
// import More_Logo_Primary from '';

import Link from 'next/link';
import { useWindowDimensions } from '../../public/hooks/useWindowDimensions';

import imageTitle1 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON01.png';
import imageTitle2 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON02.png';
import imageTitle3 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON03.png';
import imageTitle4 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON04.png';
import imageTitle5 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON05.png';
import imageTitle6 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON06.png';
import imageTitle7 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON07.png';
import imageTitle8 from '../../public/images/featuresPage/iconmenu/FEATURES_ICON08.png';

import Arrow_Down_White from '../../public/images/pricingPage/Arrow-Down_White.svg';
import Arrow_Down_Grey from '../../public/images/pricingPage/Arrow-Down_Grey.svg';

import MoreLogoWhite from '../../public/images/MoreLogoWhite.svg';
import MoreLogoPrimary from '../../public/images/MoreLogoPrimary.svg';
import Features from '../../public/images/Features.svg';
import Price from '../../public/images/Price.svg';
import Contact from '../../public/images/Contact.svg';

export const throttle = (fn, wait) => {
  let time = Date.now();
  return function () {
    if (time + wait - Date.now() < 0) {
      fn();
      time = Date.now();
    }
  };
};

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

export const Index = (mainP: { mainPage: boolean; isFeaturesPage: boolean }) => {
  const faeturesData = [
    {
      image: imageTitle1,
      title1: 'Dashboard',
      title2: '',
      idTitle: 'moreMenumorefeature001',
    },
    {
      image: imageTitle2,
      title1: 'New Messages',
      title2: '',
      idTitle: 'moreMenumorefeature002',
    },
    {
      image: imageTitle3,
      title1: 'Leads',
      title2: '',
      idTitle: 'moreMenumorefeature003',
    },
    {
      image: imageTitle4,
      title1: 'Orders',
      title2: '',
      idTitle: 'moreMenumorefeature004',
    },
    {
      image: imageTitle5,
      title1: 'Customers',
      title2: '',
      idTitle: 'moreMenumorefeature005',
    },
    {
      image: imageTitle6,
      title1: 'Products',
      title2: '',
      idTitle: 'moreMenumorefeature006',
    },
    {
      image: imageTitle7,
      title1: 'Purchase',
      title2: 'Orders',
      idTitle: 'moreMenumorefeature007',
    },
    {
      image: imageTitle8,
      title1: 'Settings',
      title2: '',
      idTitle: 'moreMenumorefeature008',
    },
  ];

  const [stickNav, setNavSticky] = useState(false);

  const [deviceWidth, setWidth] = React.useState(0);
  const [toggleMenu, setToggle] = React.useState(false);
  const [openedMenu, setOpened] = React.useState('');
  const [imgDownArrow, setimgDownArrow] = React.useState(Arrow_Down_White);
  // const [imgDownArrowStick, setimgDownArrowStick] = React.useState('/images/pricingPage/Dash.svg');

  const [featureToggle, setFeatureToggle] = React.useState(styles.unactiveFeature);
  const [toggledfeature, setToggledfeature] = React.useState(mainP.isFeaturesPage);
  const [hideStickMenu, setHideStickMenu] = React.useState(styles.showStickMenu);

  const setActiveSubject = () => {
    const pagePosition = window.pageYOffset;
    const pageHeight = (document.body.clientHeight * 12) / 100;
    if (pagePosition <= pageHeight) {
      if (document.getElementById('activeMoreSubject0')) {
        document.getElementById('activeMoreSubject0').style.color = '#0091FF';
        document.getElementById('activeMoreSubject1').style.color = '#577083';
      }
    } else if (pagePosition < pageHeight * 2) {
      if (document.getElementById('activeMoreSubject0')) {
        document.getElementById('activeMoreSubject0').style.color = '#577083';
        document.getElementById('activeMoreSubject1').style.color = '#0091FF';
        document.getElementById('activeMoreSubject2').style.color = '#577083';
      }
    } else if (pagePosition <= pageHeight * 3) {
      if (document.getElementById('activeMoreSubject0')) {
        document.getElementById('activeMoreSubject1').style.color = '#577083';
        document.getElementById('activeMoreSubject2').style.color = '#0091FF';
        document.getElementById('activeMoreSubject3').style.color = '#577083';
      }
    } else if (pagePosition <= pageHeight * 4) {
      if (document.getElementById('activeMoreSubject0')) {
        document.getElementById('activeMoreSubject2').style.color = '#577083';
        document.getElementById('activeMoreSubject3').style.color = '#0091FF';
        document.getElementById('activeMoreSubject4').style.color = '#577083';
      }
    } else if (pagePosition <= pageHeight * 5) {
      if (document.getElementById('activeMoreSubject0')) {
        document.getElementById('activeMoreSubject3').style.color = '#577083';
        document.getElementById('activeMoreSubject4').style.color = '#0091FF';
        document.getElementById('activeMoreSubject5').style.color = '#577083';
      }
    } else if (pagePosition <= pageHeight * 6) {
      if (document.getElementById('activeMoreSubject0')) {
        document.getElementById('activeMoreSubject4').style.color = '#577083';
        document.getElementById('activeMoreSubject5').style.color = '#0091FF';
        document.getElementById('activeMoreSubject6').style.color = '#577083';
      }
    } else if (pagePosition <= pageHeight * 7) {
      if (document.getElementById('activeMoreSubject0')) {
        document.getElementById('activeMoreSubject5').style.color = '#577083';
        document.getElementById('activeMoreSubject6').style.color = '#0091FF';
        document.getElementById('activeMoreSubject7').style.color = '#577083';
      }
    } else {
      if (document.getElementById('activeMoreSubject0')) {
        document.getElementById('activeMoreSubject6').style.color = '#577083';
        document.getElementById('activeMoreSubject7').style.color = '#0091FF';
      }
    }
  };

  const handleScroll = (e) => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 90) {
      if (stickNav === false) {
        setNavSticky(true);
      }
    } else {
      if (stickNav === true) {
        setNavSticky(false);
      }
    }
    if (mainP.isFeaturesPage && toggledfeature) {
      setActiveSubject();
    }
  };

  useEffect(() => {
    setWidth(window.innerWidth);
    if (!mainP.mainPage) {
      setimgDownArrow(Arrow_Down_Grey);
    }
    if (mainP.isFeaturesPage && toggledfeature) {
      if (window.pageYOffset === 0) {
        if (document.getElementById('activeMoreSubject0')) {
          document.getElementById('activeMoreSubject0').style.color = '#0091FF';
        }
      }
    }
    window.addEventListener('scroll', throttle(handleScroll, 50));

    if (window.pageYOffset > 90) {
      if (stickNav === false) {
        setNavSticky(true);
      }
    }
    return () => window.removeEventListener('scroll', handleScroll);
  });

  let logoPath = <Image src={MoreLogoWhite} width={158} height={56} alt="whitelogo" className={styles.logoImage} />;
  let mobileLogoPath = <Image src={MoreLogoWhite} width={98} height={56} alt="whitelogo" className={styles.logoMobile} />;
  const mobileLogoPathOpend = <Image src={MoreLogoPrimary} width={98} height={56} alt="primelogo" className={styles.logoMobile} />;
  let fontColor = styles.mainPageColor;
  let buttonColor = styles.mainPageButton;
  // const openClass = mobileMenu ?  : '';
  // const stickNav = false;
  // const closeClass = this.props.navbar.showMenu ? styles.openToggle : styles.closeToggle;
  if (!mainP.mainPage) {
    logoPath = <Image src={MoreLogoPrimary} width={158} height={56} alt="primelogo" className={styles.logoImage} />;
    mobileLogoPath = <Image src={MoreLogoPrimary} width={98} height={56} alt="whitelogo" className={styles.logoMobile} />;
    fontColor = styles.otherPageColor;
    buttonColor = styles.otherPageButton;
  }

  const openMenu = () => {
    if (toggleMenu === false) {
      setToggle(true);
      setOpened(styles.open);
      setHideStickMenu(styles.hideStickMenu);
    } else {
      setToggle(false);
      setOpened('');
      setHideStickMenu(styles.showStickMenu);
    }
  };

  const toggleFeatureHover = (open) => {
    if (open) {
      if (mainP.mainPage) {
        setFeatureToggle(styles.activeFeature);
        setimgDownArrow(Arrow_Down_Grey);
      }
      // setimgDownArrowStick('/images/pricingPage/Arrow-Down_Grey.svg');
      setToggledfeature(true);
    } else {
      if (mainP.mainPage) {
        setFeatureToggle(styles.unactiveFeature);
        setimgDownArrow(Arrow_Down_White);
      }
      // setimgDownArrowStick('/images/pricingPage/Dash.svg');
      setToggledfeature(false);
    }
  };

  const toggleByClick = (sticky) => {
    if (!toggledfeature) {
      toggleFeatureHover(true);
    } else {
      toggleFeatureHover(false);
    }
    if (sticky) {
      void Router.push('/features');
    }
  };

  const animateScroll = (element) => {
    // event.preventDefault();
    if (element) {
      window.scroll({
        behavior: 'smooth',
        left: 0,
        top: element.offsetTop - 250,
      });
    }
    // window.scrollTo(0, 3000);
  };

  const toggleFeatureMenuMobile = (
    <div className={styles.toggleFeatureMenuContainerMobile}>
      <div className={styles.flexToggleMenu}>
        {faeturesData.map((data, index) => (
          <div
            key={index}
            className={styles.CardContainer}
            onClick={(e) => {
              animateScroll(document.getElementById(data.idTitle));
            }}
          >
            <div className={styles.imageCard}>
              <Image alt={'imageCard' + index} src={data.image} />
            </div>
            <div id={'activeMoreSubject' + index} className={styles.titleCard}>
              <div>{data.title1}</div>
              <div>{data.title2}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const toggleFeatureStickMobile = (
    <div className={styles.toggleFeatureStickContainerMobile}>
      <div className={styles.flexToggleStick}>
        {faeturesData.map((data, index) => (
          <div
            key={index}
            className={styles.CardStickContainer}
            onClick={(e) => {
              animateScroll(document.getElementById(data.idTitle));
            }}
          >
            <div className={styles.imageStickCard}>
              <Image alt={'imageStickCard' + index} src={data.image} />
            </div>
            <div id={'activeMoreSubject' + index} className={styles.titleStickCard}>
              <div>{data.title1}</div>
              <div>{data.title2}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const mobileMenu = (
    <>
      <div className={styles.mobileNavContainer}>
        <div className={styles.mobileBarContainer}>
          <div className={styles.flexLeftSide}>
            <div className={styles.leftMenuToggle}>
              <div
                className={`${styles.hamburgerMenu} ${openedMenu}`}
                onClick={() => {
                  openMenu();
                }}
              >
                <div className={styles.circleBG}>
                  <i></i>
                </div>
              </div>
            </div>
            <div className={styles.topLogoMobile}>
              <Link href="/">
                <a>{mobileLogoPath}</a>
              </Link>
            </div>
          </div>
          <div className={styles.menuRightToggle}>
            <a href="https://app.more-commerce.com/login">
              <div className={buttonColor}>Get Started</div>
            </a>
          </div>
        </div>
      </div>
      {toggledfeature && !stickNav && toggleFeatureMenuMobile}
      {toggleMenu && (
        <div className={styles.menuBackGround}>
          <div className={styles.mobileBarContainer}>
            <div className={styles.flexLeftSide}>
              <div className={styles.leftMenuToggle}>
                <div
                  className={`${styles.hamburgerMenu} ${openedMenu}`}
                  onClick={() => {
                    openMenu();
                  }}
                >
                  <div className={styles.circleBG}>
                    <i></i>
                  </div>
                </div>
              </div>
              <div className={styles.topLogoMobile}>
                <Link href="/">
                  <a>{mobileLogoPathOpend}</a>
                </Link>
              </div>
            </div>
            <div className={styles.menuRightToggle}>
              <a href="https://app.more-commerce.com/login">
                <div className={buttonColor}>Get Started</div>
              </a>
            </div>
          </div>
          <div className={styles.menuContainer}>
            <div className={styles.priceMenu}>
              <Image alt={'FeatureMenu'} src={Features} width={20} height={20} className={styles.priceIcon} />
              <Link href="/features">
                <a href="">Features</a>
              </Link>
            </div>
            <div className={styles.priceMenu}>
              <Image alt={'PriceMenu'} src={Price} width={20} height={20} className={styles.priceIcon} />
              <Link href="/pricing">
                <a href="">Pricing</a>
              </Link>
            </div>
            <div className={styles.contactMenu}>
              <Image alt={'ContactMenu'} src={Contact} width={20} height={19} className={styles.contactIcon} />
              <Link href="/contact">
                <a href="">Contact</a>
              </Link>
            </div>
          </div>
        </div>
      )}
      {stickNav && (
        <div className={`${styles.stickyMobileNavContainer} ${hideStickMenu}`}>
          <div className={styles.stickyMobileBarContainer}>
            <div className={styles.flexLeftSide}>
              <div className={styles.leftMenuToggle}>
                <div
                  className={`${styles.hamburgerMenu} ${openedMenu}`}
                  onClick={() => {
                    openMenu();
                  }}
                >
                  <div className={styles.circleBG}>
                    <i></i>
                  </div>
                </div>
              </div>
              <div className={styles.topLogoMobile}>
                <Link href="/">
                  <a>
                    <Image alt={'MoreLogoPrimary'} src={MoreLogoPrimary} width={108} height={56} className={styles.logoImage} />
                  </a>
                </Link>
              </div>
            </div>

            <div className={styles.menuRightToggle}>
              <a href="https://app.more-commerce.com/login">
                <div className={buttonColor}>Get Started</div>
              </a>
            </div>
          </div>
        </div>
      )}
      {toggledfeature && stickNav && toggleFeatureStickMobile}
    </>
  );

  const toggleFeatureMenu = (
    <div className={styles.toggleFeatureMenuContainer}>
      <div className={styles.flexToggleMenu}>
        {faeturesData.map((data, index) => (
          <div
            key={index}
            className={styles.CardContainer}
            onClick={(e) => {
              animateScroll(document.getElementById(data.idTitle));
            }}
          >
            <div className={styles.imageCard}>
              <Image alt={'imageCard' + index} src={data.image} />
            </div>
            <div id={'activeMoreSubject' + index} className={`${styles.titleCard}`}>
              <div>{data.title1}</div>
              <div>{data.title2}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const toggleFeatureStick = (
    <div className={styles.toggleFeatureStickContainer}>
      <div className={styles.flexToggleStick}>
        {faeturesData.map((data, index) => (
          <div
            key={index}
            className={styles.CardStickContainer}
            onClick={(e) => {
              animateScroll(document.getElementById(data.idTitle));
            }}
          >
            <div className={styles.imageStickCard}>
              <Image alt={'imageStickCard' + index} src={data.image} />
            </div>
            <div id={'activeMoreSubject' + index} className={styles.titleStickCard}>
              <div>{data.title1}</div>
              <div>{data.title2}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {(deviceWidth <= 766 && mobileMenu) || (
        <div>
          <div className={`${styles.navbarContainer} ${featureToggle}`}>
            <div className={styles.menuBarContainer}>
              <div className={styles.menuLeftContent}>
                <Link href="/">
                  <a>{logoPath}</a>
                </Link>
              </div>
              <div className={styles.menuCenterContent}>
                <Link href="/features">
                  <a
                    onClick={(event) => {
                      toggleByClick(false);
                    }}
                    className={fontColor}
                  >
                    Features <Image alt={'Features-imgDownArrow'} className={styles.normalImage} src={imgDownArrow} width={10} height={6} />
                  </a>
                </Link>
                <Link href="/pricing">
                  <a className={fontColor}>Pricing</a>
                </Link>
                <Link href="/contact">
                  <a className={fontColor}>Contact</a>
                </Link>
              </div>
              <div className={styles.menuRightContent}>
                <a href="https://app.more-commerce.com/login">
                  <div className={buttonColor}>Get Started</div>
                </a>
              </div>
            </div>
          </div>
          {toggledfeature && !stickNav && toggleFeatureMenu}
          {stickNav && (
            <div className={styles.stickyNavBarContainer}>
              <div className={styles.menuBarContainer}>
                <div className={styles.menuLeftContent}>
                  <Link href="/">
                    <a>
                      <Image alt={'MoreLogoPrimary'} src={MoreLogoPrimary} width={108} height={56} className={styles.logoImage} />
                    </a>
                  </Link>
                </div>
                <div className={styles.menuCenterContent}>
                  {/* <Link href="/features"> */}
                  <a
                    style={{ cursor: 'pointer' }}
                    onClick={(event) => {
                      toggleByClick(true);
                    }}
                    className={fontColor}
                  >
                    Features <Image className={`${styles.normalImage} ${styles.normalBT}`} alt={'Arrow-Down_Grey'} src={Arrow_Down_Grey} width={10} height={6} />
                  </a>
                  {/* </Link> */}
                  <Link href="/pricing">
                    <a className={styles.otherPageColor}>Pricing</a>
                  </Link>
                  <Link href="/contact">
                    <a className={styles.otherPageColor}>Contact</a>
                  </Link>
                </div>
                <div className={styles.menuRightContent}>
                  <a href="https://app.more-commerce.com/login">
                    <div className={styles.otherPageButton}>Get Started</div>
                  </a>
                </div>
              </div>
            </div>
          )}
          {toggledfeature && stickNav && toggleFeatureStick}
        </div>
      )}
    </>
  );
  // }
};
export default Index;
