export enum EcosystemKeyEnum {
  AUTODIGI = 'autodigi',
  SOCIAL = 'more-commerce',
  CMS = 'localhost',
}

export enum EcosystemRouteEnum {
  AUTODIGI = 'https://www.itopplus.com/autodigi',
  SOCIAL = 'https://more-commerce.com',
  CMS = 'https://www.itopplus.com/',
}

export enum EcosystemTitleEnum {
  AUTODIGI = 'AUDODIGI',
  SOCIAL = 'SOCIAL',
  CMS = 'CMS',
}

export enum EcosystemIconWhiteEnum {
  AUTODIGI = 'assets/ecosystem/autodigi-white.svg',
  SOCIAL = 'assets/ecosystem/social-white.svg',
  CMS = 'assets/ecosystem/cms-white.svg',
}

export enum EcosystemIconEnum {
  AUTODIGI = 'assets/ecosystem/autodigi.svg',
  SOCIAL = 'assets/ecosystem/social.svg',
  CMS = 'assets/ecosystem/cms.svg',
}

export enum EcosystemColorEnum {
  AUTODIGI = '#1C242A',
  SOCIAL = '#0091FF',
  CMS = '#2FC639',
}

export interface IEcosystem {
  key: string;
  route: string;
  title: string;
  activeStatus: boolean;
  icon: string;
  colorCode: string;
  backgroundImg: string;
  allowChangeRoute: boolean;
}
