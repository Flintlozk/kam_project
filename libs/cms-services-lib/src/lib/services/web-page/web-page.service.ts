import {
  IWebPageConfiguration,
  IWebPagePermission,
  IWebPageSetting,
  IWebPageFromToContainer,
  IWebPageOrderNumber,
  IUpdateWebPagesHide,
  IWebPage,
  IWebPagePage,
  WebPagePermissionType,
  IWebPageDetails,
  EnumLanguageCultureUI,
  EMegaMenuType,
  EBackgroundPosition,
  ElinkType,
  IMegaOptionTextImage,
  IMegaFooterOptionTextImage,
  IMegaConfigTextImage,
  IMegaFooterConfigTextImage,
  IMegaOption,
  IMegaFooterOption,
  IMegaConfig,
  IMegaFooterConfig,
  IMockWebPage,
} from '@reactor-room/cms-models-lib';
import { CRUD_MODE, IHTTPResult } from '@reactor-room/model-lib';
import { isEmpty } from 'lodash';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import {
  getWebPagesByPageID,
  updateWebPageOrderNumbers,
  getPagesByLevel,
  addPageToLevel,
  removePageFromLevel,
  updateWebPageName,
  updateSiteHide,
  updateWebPageHomepage,
  getWebPageByWebPageID,
  updateWebPageDetailsSetting,
  updateWebPageDetailsPermission,
  updateWebPageDetailsConfig,
  addWebPageDetailsConfig,
  getPageByLevel,
  getLandingWebPageByName,
  saveWebPagesMocks,
  deleteWebPagesMocks,
  getWebPagesMocks,
  getWebPageMockByUserID,
} from '../../data/web-page/web-page.data';
import { getConfigGeneralLanguage } from '../../data/config/get-config.data';
import { createPageComponent } from '../component/component.service';
import { createMongooseId } from '@reactor-room/itopplus-back-end-helpers';
import { getSingleComponent } from '../../data/component/component.data';
import { getLandingNameByComponentType } from '../../domains';

export class WebPageService {
  removeWebPageFromContainer = async (pageID: number, webPagePositions: IWebPageFromToContainer[], webPageOrderNumbers: IWebPageOrderNumber[]): Promise<IHTTPResult> => {
    const session = await PlusmarService.mongoConnector.startSession();
    session.startTransaction();
    try {
      for (let index = 0; index < webPagePositions.length; index++) {
        const removePageFromLevelResult = await removePageFromLevel(pageID, webPagePositions[index]._id, webPagePositions[index].level, webPagePositions[index].parentID, session);
        if (isEmpty(removePageFromLevelResult)) throw new Error('Cannot Remove Site Position at pageID: ' + webPagePositions[index]._id);
      }
      try {
        for (let index = 0; index < webPageOrderNumbers.length; index++) {
          const siteOrderNumber = webPageOrderNumbers[index];
          await updateWebPageOrderNumbers(pageID, siteOrderNumber, session);
        }
      } catch (error) {
        throw new Error('Cannot Update Sites Order Number');
      }
      await session.commitTransaction();
      session.endSession();
      return { status: 200, value: true };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log('error->removeWebPageFromContainer :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  updateWebPageFromToContainer = async (
    pageID: number,
    previousWebPagePositions: IWebPageFromToContainer[],
    nextWebPagePositions: IWebPageFromToContainer[],
    oldWebPageOrderNumbers: IWebPageOrderNumber[],
    newWebPageOrderNumbers: IWebPageOrderNumber[],
  ): Promise<IHTTPResult> => {
    const session = await PlusmarService.mongoConnector.startSession();
    session.startTransaction();
    try {
      for (let index = 0; index < previousWebPagePositions.length; index++) {
        const page = await getPageByLevel(pageID, previousWebPagePositions[index].level, previousWebPagePositions[index]._id, session);
        if (isEmpty(page)) throw new Error('Page Not Found');
        const removePageFromLevelResult = await removePageFromLevel(
          pageID,
          previousWebPagePositions[index]._id,
          previousWebPagePositions[index].level,
          previousWebPagePositions[index].parentID,
          session,
        );
        if (isEmpty(removePageFromLevelResult)) throw new Error('Cannot Remove Previous Site Position at pageID: ' + previousWebPagePositions[index]._id);
        if (page._id != nextWebPagePositions[index]._id) throw new Error('Cannot Find Next Site Position at pageID: ' + previousWebPagePositions[index]._id);
        page.parentID = nextWebPagePositions[index].parentID;
        const addPageToLevelResult = await addPageToLevel(pageID, page, nextWebPagePositions[index].level, session);
        if (isEmpty(addPageToLevelResult)) throw new Error('Cannot Add Next Site Position at pageID: ' + nextWebPagePositions[index]._id);
      }
      try {
        for (let index = 0; index < oldWebPageOrderNumbers.length; index++) {
          const oldSiteOrderNumber = oldWebPageOrderNumbers[index];
          await updateWebPageOrderNumbers(pageID, oldSiteOrderNumber, session);
        }
      } catch (error) {
        throw new Error('Cannot Update Old Sites Order Number');
      }
      try {
        for (let index = 0; index < newWebPageOrderNumbers.length; index++) {
          const newSiteOrderNumber = newWebPageOrderNumbers[index];
          await updateWebPageOrderNumbers(pageID, newSiteOrderNumber, session);
        }
      } catch (error) {
        throw new Error('Cannot Update New Sites Order Number');
      }
      await session.commitTransaction();
      session.endSession();
      return { status: 200, value: true };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log('error->updateWebPageFromToContainer :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  updateWebPageDetails = async (pageID: number, _id: string, pageDetails: IWebPageDetails): Promise<IHTTPResult> => {
    const session = await PlusmarService.mongoConnector.startSession();
    session.startTransaction();
    try {
      if (typeof pageDetails.setting.mega.primaryOption === 'string')
        pageDetails.setting.mega.primaryOption = JSON.parse(pageDetails.setting.mega.primaryOption.toString()) as IMegaOption;
      if (typeof pageDetails.setting.mega.footerOption === 'string')
        pageDetails.setting.mega.footerOption = JSON.parse(pageDetails.setting.mega.footerOption.toString()) as IMegaFooterOption;
      pageDetails.configs.forEach((config) => {
        if (typeof config.primaryMega === 'string') config.primaryMega = JSON.parse(config.primaryMega.toString()) as IMegaConfig;
        if (typeof config.footerMega === 'string') config.footerMega = JSON.parse(config.footerMega.toString()) as IMegaFooterConfig;
      });
      await updateWebPageDetailsSetting(pageID, _id, pageDetails.setting, session);
      await updateWebPageDetailsPermission(pageID, _id, pageDetails.permission, session);
      const configsToUpdate = pageDetails.configs.filter((config) => config?.mode === CRUD_MODE.EDIT);
      const configsToAdd = pageDetails.configs.filter((config) => config?.mode === CRUD_MODE.ADD);
      for (let index = 0; index < configsToUpdate?.length; index++) {
        delete configsToUpdate[index]?.mode;
        await updateWebPageDetailsConfig(pageID, _id, configsToUpdate[index], session);
      }
      for (let index = 0; index < configsToAdd?.length; index++) {
        delete configsToAdd[index]?.mode;
        await addWebPageDetailsConfig(pageID, _id, configsToAdd[index], session);
      }
      await session.commitTransaction();
      session.endSession();
      return { status: 200, value: true };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log('error->updateWebPageDetails :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  updateWebPageName = async (pageID: number, name: string, level: number, _id: string): Promise<IHTTPResult> => {
    try {
      await updateWebPageName(pageID, name, level, _id);
      return { status: 200, value: true };
    } catch (error) {
      console.log('error->updateWebPageName :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  updateWebPagesHide = async (pageID: number, updateWebPagesHide: IUpdateWebPagesHide[], ishide: boolean): Promise<IHTTPResult> => {
    const session = await PlusmarService.mongoConnector.startSession();
    session.startTransaction();
    try {
      for (let index = 0; index < updateWebPagesHide.length; index++) {
        await updateSiteHide(pageID, updateWebPagesHide[index].level, updateWebPagesHide[index]._id, ishide, session);
      }
      await session.commitTransaction();
      session.endSession();
      return { status: 200, value: true };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log('error->updateSiteHide :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  updateWebPageHomepage = async (pageID: number, previousLevel: number, previousId: string, currentLevel: number, currentId: string): Promise<IHTTPResult> => {
    const session = await PlusmarService.mongoConnector.startSession();
    session.startTransaction();
    try {
      if (previousLevel && previousId) await updateWebPageHomepage(pageID, previousLevel, previousId, false, session);
      await updateWebPageHomepage(pageID, currentLevel, currentId, true, session);
      await session.commitTransaction();
      session.endSession();
      return { status: 200, value: true };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log('error->updateWebPageHomepage :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  updateWebPageOrderNumbers = async (pageID: number, webPageOrderNumbers: IWebPageOrderNumber[]): Promise<IHTTPResult> => {
    const session = await PlusmarService.mongoConnector.startSession();
    session.startTransaction();
    try {
      for (let index = 0; index < webPageOrderNumbers.length; index++) {
        const siteOrderNumber = webPageOrderNumbers[index];
        await updateWebPageOrderNumbers(pageID, siteOrderNumber, session);
      }
      await session.commitTransaction();
      session.endSession();
      return { status: 200, value: true };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log('error->updateSiteOrderNumber :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  createWebPage = async (pageID: number, level: number, page: IWebPagePage): Promise<IWebPagePage> => {
    const session = await PlusmarService.mongoConnector.startSession();
    session.startTransaction();
    try {
      const { defaultCultureUI } = await getConfigGeneralLanguage(pageID);
      page = this.initCreateSiteDefault(defaultCultureUI, page);
      page._id = createMongooseId();
      const addPageToLevelResult = await addPageToLevel(pageID, page, level, session);
      if (isEmpty(addPageToLevelResult)) throw new Error('Cannot Add A Page');
      const createPageComponentResult = await createPageComponent(page._id, pageID, session);
      if (!createPageComponentResult) {
        throw new Error('Not Page Component');
      }
      const pages = await getPagesByLevel(pageID, level, session);
      const addedPage: IWebPagePage = pages[pages.length - 1];
      if (isEmpty(addedPage)) throw new Error('Not Found Added Page');
      await session.commitTransaction();
      session.endSession();
      return addedPage;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log('error->createWebPage :>> ', error);
      return null;
    }
  };

  initCreateSiteDefault(defaultCultureUI: EnumLanguageCultureUI, page: IWebPagePage): IWebPagePage {
    const defaultSetting: IWebPageSetting = {
      isOpenNewTab: false,
      isMaintenancePage: false,
      isIcon: false,
      pageIcon: '',
      isMega: false,
      mega: {
        primaryType: EMegaMenuType.IMAGE_TEXT,
        footerType: EMegaMenuType.IMAGE_TEXT,
        primaryOption: {
          linkType: ElinkType.URL,
          linkParent: '',
          linkUrl: '',
          image: '',
          imagePosition: EBackgroundPosition.CENTER_CENTER,
          isTopTitle: false,
          textImage: '',
          isHTML: true,
        } as IMegaOptionTextImage,
        footerOption: {
          isFooterHTML: true,
          textImage: '',
        } as IMegaFooterOptionTextImage,
      },
      socialShare: '',
    };
    const defaultPermission: IWebPagePermission = {
      type: WebPagePermissionType.EVERYONE,
      option: {
        password: '',
        onlyPaidMember: false,
      },
    };
    const defaultConfigs: IWebPageConfiguration[] = [
      {
        cultureUI: defaultCultureUI ? defaultCultureUI : EnumLanguageCultureUI.EN,
        displayName: page?.name,
        seo: {
          title: page?.name,
          shortUrl: '',
          description: '',
          keyword: '',
        },
        primaryMega: {
          topTitle: '',
          description: '',
          html: '',
          textImage: '',
        } as IMegaConfigTextImage,
        footerMega: {
          html: '',
          textImage: '',
        } as IMegaFooterConfigTextImage,
      },
    ];
    page.setting = defaultSetting;
    page.permission = defaultPermission;
    page.configs = defaultConfigs;
    return page;
  }

  getWebPagesByPageID = async (pageID: number): Promise<IWebPage[]> => {
    try {
      return await getWebPagesByPageID(pageID);
    } catch (error) {
      console.log('error->getWebPagesByPageID :>> ', error);
      return null;
    }
  };
  getWebPagesMocks = async (userID: number): Promise<IMockWebPage[]> => {
    try {
      return await getWebPagesMocks(userID);
    } catch (error) {
      console.log('error->getWebPagesByPageID :>> ', error);
      return null;
    }
  };
  saveWebPagesMocks = async (webPages: IMockWebPage[]): Promise<boolean> => {
    try {
      return await saveWebPagesMocks(webPages);
    } catch (error) {
      console.log('error->saveWebPagesMocks :>> ', error);
      return null;
    }
  };
  deleteWebPagesMocks = async (userID: number): Promise<boolean> => {
    try {
      return await deleteWebPagesMocks(userID);
    } catch (error) {
      console.log('error->saveWebPagesMocks :>> ', error);
      return null;
    }
  };

  getWebPageByWebPageID = async (pageID: number, _id: string): Promise<IWebPagePage> => {
    try {
      return await getWebPageByWebPageID(pageID, _id);
    } catch (error) {
      console.log('error->getWebPagesByPageID :>> ', error);
      return null;
    }
  };

  getWebPageMockByUserID = async (userID: number, _id: string): Promise<IWebPagePage> => {
    try {
      return await getWebPageMockByUserID(userID, _id);
    } catch (error) {
      console.log('error->getWebPagesByPageID :>> ', error);
      return null;
    }
  };

  getHomePageId = async (pageID): Promise<IHTTPResult> => {
    try {
      const allWebPage = await this.getWebPagesByPageID(pageID);
      let allWebPagesMerge = [] as IWebPagePage[];
      allWebPage.forEach((webPage) => {
        allWebPagesMerge = allWebPagesMerge.concat(webPage.pages);
      });
      const homePage = allWebPagesMerge.find((page) => page.isHomepage);
      return { status: 200, value: homePage._id };
    } catch (error) {
      console.log('error->getHomePageId :>> ', error);
      throw Error('error->getHomePageId :>> ' + error);
    }
  };
  getHomePageIdMock = async (userID): Promise<IHTTPResult> => {
    try {
      const allWebPage = await this.getWebPagesMocks(userID);
      let allWebPagesMerge = [];
      allWebPage.forEach((webPage) => {
        allWebPagesMerge = allWebPagesMerge.concat(webPage.pages);
      });
      const homePage = allWebPagesMerge.find((page) => page.isHomepage);
      return { status: 200, value: homePage._id };
    } catch (error) {
      console.log('error->getHomePageIdMock :>> ', error);
      throw Error('error->getHomePageIdMock :>> ' + error);
    }
  };
  getAllWebPage = async (pageID): Promise<IWebPagePage[]> => {
    try {
      const allWebPage = await this.getWebPagesByPageID(pageID);
      let allWebPagesMerge: IWebPagePage[] = [];
      allWebPage.forEach((webPage) => {
        allWebPagesMerge = allWebPagesMerge.concat(webPage.pages);
      });

      return allWebPagesMerge;
    } catch (error) {
      console.log('error->getWebPagesByPageID :>> ', error);
      throw Error('error->getWebPagesByPageID :>> ' + error);
    }
  };

  getLandingWebPageByName = async (previousWebPageID: string, pageID: number, componentId: string): Promise<IWebPagePage> => {
    try {
      const previousComponent = await getSingleComponent(previousWebPageID, pageID, componentId);
      const name = getLandingNameByComponentType(previousComponent.componentType);
      const landingWebPage = await getLandingWebPageByName(pageID, name);
      return landingWebPage;
    } catch (error) {
      console.log('error->getLandingWebPageByName :>> ', error);
      throw Error('error->getLandingWebPageByName :>> ' + error);
    }
  };
}
