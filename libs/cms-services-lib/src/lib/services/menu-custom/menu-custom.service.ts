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
  IMenuGroup,
} from '@reactor-room/cms-models-lib';
import { CRUD_MODE, IHTTPResult } from '@reactor-room/model-lib';
import { isEmpty } from 'lodash';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import {
  getMenuPagesByPageID,
  updateMenuPageOrderNumbers,
  getPagesByLevel,
  addPageToLevel,
  removePageFromLevel,
  updateMenuPageName,
  updateSiteHide,
  updateMenuPageHomepage,
  getMenuPageByMenuPageID,
  updateMenuPageDetailsSetting,
  updateMenuPageDetailsPermission,
  updateMenuPageDetailsConfig,
  addWebPageDetailsConfig,
  getPageByLevel,
  getMenuGroup,
} from '../../data/menu-custom/menu-custom.data';
import { getConfigGeneralLanguage } from '../../data/config/get-config.data';

export class MenuCustomService {
  removeMenuPageFromContainer = async (
    pageID: number,
    menuPagePositions: IWebPageFromToContainer[],
    menuPageOrderNumbers: IWebPageOrderNumber[],
    menuGroupId: string,
  ): Promise<IHTTPResult> => {
    const session = await PlusmarService.mongoConnector.startSession();
    session.startTransaction();
    try {
      for (let index = 0; index < menuPagePositions.length; index++) {
        const removePageFromLevelResult = await removePageFromLevel(
          pageID,
          menuPagePositions[index]._id,
          menuPagePositions[index].level,
          menuPagePositions[index].parentID,
          menuGroupId,
          session,
        );
        if (isEmpty(removePageFromLevelResult)) throw new Error('Cannot Remove Site Position at pageID: ' + menuPagePositions[index]._id);
      }
      try {
        for (let index = 0; index < menuPageOrderNumbers.length; index++) {
          const siteOrderNumber = menuPageOrderNumbers[index];
          await updateMenuPageOrderNumbers(pageID, siteOrderNumber, menuGroupId, session);
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
      console.log('error->removeMenuPageFromContainer :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  updateMenuPageFromToContainer = async (
    pageID: number,
    previousMenuPagePositions: IWebPageFromToContainer[],
    nextMenuPagePositions: IWebPageFromToContainer[],
    oldWebPageOrderNumbers: IWebPageOrderNumber[],
    newWebPageOrderNumbers: IWebPageOrderNumber[],
    menuGroupId: string,
  ): Promise<IHTTPResult> => {
    const session = await PlusmarService.mongoConnector.startSession();
    session.startTransaction();
    try {
      for (let index = 0; index < previousMenuPagePositions.length; index++) {
        const page = await getPageByLevel(pageID, previousMenuPagePositions[index].level, previousMenuPagePositions[index]._id, menuGroupId, session);
        if (isEmpty(page)) throw new Error('Page Not Found');
        const removePageFromLevelResult = await removePageFromLevel(
          pageID,
          previousMenuPagePositions[index]._id,
          previousMenuPagePositions[index].level,
          previousMenuPagePositions[index].parentID,
          menuGroupId,
          session,
        );
        if (isEmpty(removePageFromLevelResult)) throw new Error('Cannot Remove Previous Site Position at pageID: ' + previousMenuPagePositions[index]._id);
        if (page._id != nextMenuPagePositions[index]._id) throw new Error('Cannot Find Next Site Position at pageID: ' + previousMenuPagePositions[index]._id);
        page.parentID = nextMenuPagePositions[index].parentID;
        const addPageToLevelResult = await addPageToLevel(pageID, page, nextMenuPagePositions[index].level, menuGroupId, session);
        if (isEmpty(addPageToLevelResult)) throw new Error('Cannot Add Next Site Position at pageID: ' + nextMenuPagePositions[index]._id);
      }
      try {
        for (let index = 0; index < oldWebPageOrderNumbers.length; index++) {
          const oldSiteOrderNumber = oldWebPageOrderNumbers[index];
          await updateMenuPageOrderNumbers(pageID, oldSiteOrderNumber, menuGroupId, session);
        }
      } catch (error) {
        throw new Error('Cannot Update Old Sites Order Number');
      }
      try {
        for (let index = 0; index < newWebPageOrderNumbers.length; index++) {
          const newSiteOrderNumber = newWebPageOrderNumbers[index];
          await updateMenuPageOrderNumbers(pageID, newSiteOrderNumber, menuGroupId, session);
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
      console.log('error->updateMenuPageFromToContainer :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  updateMenuPageDetails = async (pageID: number, _id: string, pageDetails: IWebPageDetails, menuGroupId: string): Promise<IHTTPResult> => {
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
      await updateMenuPageDetailsSetting(pageID, _id, pageDetails.setting, menuGroupId, session);
      await updateMenuPageDetailsPermission(pageID, _id, pageDetails.permission, menuGroupId, session);
      const configsToUpdate = pageDetails.configs.filter((config) => config?.mode === CRUD_MODE.EDIT);
      const configsToAdd = pageDetails.configs.filter((config) => config?.mode === CRUD_MODE.ADD);
      for (let index = 0; index < configsToUpdate?.length; index++) {
        delete configsToUpdate[index]?.mode;
        await updateMenuPageDetailsConfig(pageID, _id, configsToUpdate[index], menuGroupId, session);
      }
      for (let index = 0; index < configsToAdd?.length; index++) {
        delete configsToAdd[index]?.mode;
        await addWebPageDetailsConfig(pageID, _id, configsToAdd[index], menuGroupId, session);
      }
      await session.commitTransaction();
      session.endSession();
      return { status: 200, value: true };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log('error->updateMenuPageDetails :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  updateMenuPageName = async (pageID: number, name: string, level: number, _id: string, menuGroupId: string): Promise<IHTTPResult> => {
    try {
      await updateMenuPageName(pageID, name, level, _id, menuGroupId);
      return { status: 200, value: true };
    } catch (error) {
      console.log('error->updateMenuPageName :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  updateMenuPagesHide = async (pageID: number, updateMenuPagesHide: IUpdateWebPagesHide[], ishide: boolean, menuGroupId: string): Promise<IHTTPResult> => {
    const session = await PlusmarService.mongoConnector.startSession();
    session.startTransaction();
    try {
      for (let index = 0; index < updateMenuPagesHide.length; index++) {
        await updateSiteHide(pageID, updateMenuPagesHide[index].level, updateMenuPagesHide[index]._id, ishide, menuGroupId, session);
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

  updateMenuPageHomepage = async (
    pageID: number,
    previousLevel: number,
    previousId: string,
    currentLevel: number,
    currentId: string,
    menuGroupId: string,
  ): Promise<IHTTPResult> => {
    const session = await PlusmarService.mongoConnector.startSession();
    session.startTransaction();
    try {
      if (previousLevel && previousId) await updateMenuPageHomepage(pageID, previousLevel, previousId, false, menuGroupId, session);
      await updateMenuPageHomepage(pageID, currentLevel, currentId, true, menuGroupId, session);
      await session.commitTransaction();
      session.endSession();
      return { status: 200, value: true };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log('error->updateMenuPageHomepage :>> ', error);
      return { status: 403, value: error?.message?.toString() };
    }
  };

  updateMenuPageOrderNumbers = async (pageID: number, menuPageOrderNumbers: IWebPageOrderNumber[], menuGroupId: string): Promise<IHTTPResult> => {
    const session = await PlusmarService.mongoConnector.startSession();
    session.startTransaction();
    try {
      for (let index = 0; index < menuPageOrderNumbers.length; index++) {
        const siteOrderNumber = menuPageOrderNumbers[index];
        await updateMenuPageOrderNumbers(pageID, siteOrderNumber, menuGroupId, session);
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

  createMenuPage = async (pageID: number, level: number, page: IWebPagePage, menuGroupId: string): Promise<IWebPagePage> => {
    const session = await PlusmarService.mongoConnector.startSession();
    session.startTransaction();
    try {
      const { defaultCultureUI } = await getConfigGeneralLanguage(pageID);
      page = this.initCreateSiteDefault(defaultCultureUI, page);
      const addPageToLevelResult = await addPageToLevel(pageID, page, level, menuGroupId, session);
      if (isEmpty(addPageToLevelResult)) throw new Error('Cannot Add A Page');
      const pages = await getPagesByLevel(pageID, level, menuGroupId, session);
      const addedPage: IWebPagePage = pages[pages.length - 1];
      if (isEmpty(addedPage)) throw new Error('Not Found Added Page');
      await session.commitTransaction();
      session.endSession();
      return addedPage;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log('error->createMenuPage :>> ', error);
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

  getMenuGroup = async (pageID: number): Promise<IMenuGroup[]> => {
    try {
      return await getMenuGroup(pageID);
    } catch (error) {
      console.log('error->getMenuGroup :>> ', error);
      return null;
    }
  };

  getMenuPagesByPageID = async (pageID: number, menuGroupId: string): Promise<IWebPage[]> => {
    try {
      return await getMenuPagesByPageID(pageID, menuGroupId);
    } catch (error) {
      console.log('error->getMenuPagesByPageID :>> ', error);
      return null;
    }
  };

  getMenuPageByMenuPageID = async (pageID: number, _id: string, menuGroupId: string): Promise<IWebPagePage> => {
    try {
      return await getMenuPageByMenuPageID(pageID, _id, menuGroupId);
    } catch (error) {
      console.log('error->getMenuPageByMenuPageID :>> ', error);
      return null;
    }
  };
}
