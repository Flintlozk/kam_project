import { IThemeAssets, IThemeRendering, IRenderingComponentData, IUpdateThumnail, IThemeSharingComponentConfig, IThemeSharingComponent } from '@reactor-room/cms-models-lib';
import { IThemeRenderingSettingColors, IThemeRenderingSettingFont, IThemeDevice } from '@reactor-room/cms-models-lib';
import { ThemeComponentModel, themeSchemaModel as Theme, ThemeComponentModel as ThemeComponent } from '@reactor-room/cms-model-mongo-lib';
import { PageRenderingComponentModel } from '@reactor-room/cms-model-mongo-lib';
import mongoose, { ClientSession } from 'mongoose';
import { IHTTPResult } from '@reactor-room/model-lib';
import { convertThemeSettingsColor } from '../../domains/themes';
export async function getThemeByThemeId(themeID: string): Promise<IThemeRendering> {
  const theme = await Theme.findOne({ _id: themeID }).lean();
  return theme;
}
export async function getSharingThemeConfig(pageID: number): Promise<IThemeSharingComponentConfig> {
  const result = await ThemeComponentModel.findOne({ pageID }).lean();
  return result;
}
export async function updateSharingThemeConfigDevices(pageID: number, devices: IThemeDevice[], session?: ClientSession): Promise<void> {
  const query = { pageID };
  const setUpdate = { $set: { devices } };
  session ? await ThemeComponentModel.updateOne(query, setUpdate).session(session) : await ThemeComponentModel.updateOne(query, setUpdate).exec();
}
export async function updateSharingThemeConfigColor(pageID: number, color: IThemeRenderingSettingColors[], session?: ClientSession): Promise<void> {
  const query = { pageID };
  const setUpdate = { $set: { color } };
  session ? await ThemeComponentModel.updateOne(query, setUpdate).session(session) : await ThemeComponentModel.updateOne(query, setUpdate).exec();
}
export async function updateSharingThemeConfigFont(pageID: number, font: IThemeRenderingSettingFont[], session?: ClientSession): Promise<void> {
  const query = { pageID };
  const setUpdate = { $set: { font } };
  session ? await ThemeComponentModel.updateOne(query, setUpdate).session(session) : await ThemeComponentModel.updateOne(query, setUpdate).exec();
}

export async function getHtmlByThemeId(themeID: string, index: number): Promise<IHTTPResult> {
  const theme = await Theme.findOne({ _id: themeID });
  return { status: 200, value: theme?.html[index] };
}
export async function getCssByThemeId(themeID: string, index: number): Promise<IHTTPResult> {
  const theme = await Theme.findOne({ _id: themeID });
  return { status: 200, value: theme?.style[index]?.plaintext };
}
export async function getJavascriptByThemeId(themeID: string, index: number): Promise<IHTTPResult> {
  const theme = await Theme.findOne({ _id: themeID });
  return { status: 200, value: theme?.javascript[index]?.plaintext };
}
export async function createTheme(themeRedering: IThemeRendering): Promise<{ _id: string }> {
  const mockData = new Theme(themeRedering);
  mockData._id = mongoose.Types.ObjectId();
  mockData.isActive = true;
  const component = [] as IRenderingComponentData[];
  const themecomponent = { themeComponent: component };
  mockData.themeComponents.push(themecomponent);
  const saveResult = await mockData.save();
  if (saveResult) return mockData._id;
  else return { _id: 'error' };
}
export async function deleteTheme(themeID: string): Promise<boolean> {
  const set = {
    $set: { isActive: false },
  };
  const saveResult = await Theme.updateOne({ _id: themeID }, set);
  if (saveResult) return true;
  else return false;
}
export async function updateCssByThemeId(asset: IThemeAssets, _id: string): Promise<boolean> {
  const mockData = await Theme.findOne({ _id });
  mockData.style.push(asset);
  const saveResult = await mockData.save();
  if (saveResult) return true;
  else return false;
}
export async function updateCssPlainTextByThemeId(asset: IThemeAssets, _id: string): Promise<boolean> {
  const mockData = await Theme.findOne({ _id });
  mockData.style[asset.index].plaintext = asset.plaintext;
  const saveResult = await mockData.save();
  if (saveResult) return true;
  else return false;
}
export async function updateJavascriptByThemeId(asset: IThemeAssets, _id: string): Promise<boolean> {
  const mockData = await Theme.findOne({ _id });
  mockData.javascript.push(asset);
  const saveResult = await mockData.save();
  if (saveResult) return true;
  else return false;
}
export async function updateJavascriptPlainTextByThemeId(asset: IThemeAssets, _id: string): Promise<boolean> {
  const mockData = await Theme.findOne({ _id });
  mockData.javascript[asset.index].plaintext = asset.plaintext;
  const saveResult = await mockData.save();
  if (saveResult) return true;
  else return false;
}
export async function updateHTMLPlainTextByThemeId(asset: IThemeAssets, _id: string, pageComponent: IRenderingComponentData[]): Promise<boolean> {
  const mockData = await Theme.findOne({ _id });
  delete mockData.themeComponents;
  mockData.html[asset.index].html = asset.plaintext;
  mockData.themeComponents[asset.index].themeComponent = pageComponent;

  const saveResult = await mockData.save();
  if (saveResult) return true;
  else return false;
}
export async function updateImageByThemeId(asset: IThemeAssets, _id: string): Promise<boolean> {
  const mockData = await Theme.findOne({ _id });
  mockData.image.push(asset);
  const saveResult = await mockData.save();
  if (saveResult) return true;
  else return false;
}
export async function updateTheme(themeRedering: IThemeRendering): Promise<boolean> {
  const { _id, name, settings, devices } = themeRedering;
  const convertColor = convertThemeSettingsColor(themeRedering.settings.color);
  settings.color = convertColor;
  const set = {
    $set: { name, settings, devices },
  };
  const mockData = await Theme.findOneAndUpdate({ _id: _id }, set);
  const saveResult = await mockData.save();
  if (saveResult) return true;
  else return false;
}

export async function getTotalThemeNumber(): Promise<number> {
  const total = await Theme.countDocuments().exec();
  return total;
}

export async function getThemesByLimit(skip: number, limit: number): Promise<IThemeRendering[]> {
  const themes = await Theme.find({}).skip(skip).limit(limit);
  return themes;
}
export const findThemeComponent = async (pageID: number, session: ClientSession): Promise<IThemeSharingComponent> => {
  return await ThemeComponent.findOne({ pageID }).session(session);
};

export const addSharingThemeComponentData = async (item: IRenderingComponentData, pageID: number, session: ClientSession): Promise<boolean> => {
  const { _id, componentType, section, commonSettings, options, layoutPosition, layoutID } = item;
  const query = { pageID };
  const update = {
    $push: {
      themeComponents: {
        _id: _id,
        componentType: componentType,
        section: section,
        commonSettings: commonSettings,
        themeOption: {
          themeIdentifier: _id,
        },
        options: options,
        themeLayoutID: layoutID,
        layoutPosition: layoutPosition,
        isActive: true,
      },
    },
  };
  const saveResult = await ThemeComponent.updateOne(query, update).session(session);
  if (saveResult) return true;
  else throw new Error('addSharingThemeComponentData');
};
export const addSharingThemeComponentDataRefference = async (item: IRenderingComponentData, pageID: number, session: ClientSession): Promise<boolean> => {
  const { prevId, _id } = item;
  const query = { pageID };
  const update = {
    $push: {
      themeComponents: {
        _id: mongoose.Types.ObjectId(),
        themeOption: {
          themeIdentifier: prevId,
        },
        nextId: _id,
      },
    },
  };
  const saveResult = await ThemeComponent.updateOne(query, update).session(session);
  if (saveResult) return true;
  else throw new Error('addSharingThemeComponentDataRefference');
};

export const removeSharingThemeComponentData = async (id: string, pageID: number, session: ClientSession): Promise<boolean> => {
  const saveResult = await ThemeComponent.updateOne(
    { pageID },
    {
      $pull: {
        themeComponents: {
          themeOption: {
            themeIdentifier: id,
          },
        },
      },
    },
  ).session(session);
  if (saveResult) return true;
  else throw new Error('removeSharingThemeComponentData');
};
export const getSharingThemeComponentByThemeId = async (_id: string, pageID: number, session: ClientSession): Promise<IThemeSharingComponent> => {
  return await ThemeComponent.findOne({ pageID, 'themeComponents.themeOption.themeIdentifier': _id }, { 'themeComponents.themeOption.themeIdentifier.$': 1 })
    .session(session)
    .lean();
};

export const updateSharingThemeComponentData = async (item: IRenderingComponentData, pageID: number, session: ClientSession): Promise<boolean> => {
  const { _id, commonSettings, options, layoutPosition, layoutID } = item;
  const saveResult = await ThemeComponent.updateOne(
    { pageID, 'themeComponents.themeOption.themeIdentifier': _id },
    {
      $set: {
        'themeComponents.$.isActive': true,
        'themeComponents.$.commonSettings': commonSettings,
        'themeComponents.$.options': options,
        'themeComponents.$.layoutPosition': layoutPosition,
        'themeComponents.$.themeLayoutID': layoutID,
      },
    },
  ).session(session);
  if (saveResult) return true;
  else throw new Error('updateSharingThemeComponentData');
};
export const updateLastIdSharingThemeComponentToLinkedList = async (_id: string, pageID: number, session: ClientSession): Promise<boolean> => {
  const saveResult = await ThemeComponent.updateOne(
    { pageID, 'themeComponents.themeOption.themeIdentifier': _id },
    {
      $set: {
        'themeComponents.$.nextId': null,
      },
    },
  ).session(session);
  if (saveResult) return true;
  else throw new Error('updateLastIdSharingThemeComponentToLinkedList');
};

export const moveSharingThemeComponentData = async (item: IRenderingComponentData, pageID: number, session: ClientSession): Promise<boolean> => {
  const { _id, prevId } = item;
  const saveResult = await ThemeComponent.updateOne(
    { pageID, 'themeComponents.themeOption.themeIdentifier': prevId },
    {
      $set: {
        'themeComponents.$.nextId': _id,
      },
    },
  ).session(session);
  if (saveResult) return true;
  else throw new Error('moveSharingThemeComponentData');
};

export const getThemeComponentsLocal = async (webPageID: string, pageID: number): Promise<IRenderingComponentData[]> => {
  const themeLocal = await PageRenderingComponentModel.findOne({ webPageID, pageID }).lean();
  return themeLocal?.themeComponents ? themeLocal?.themeComponents : [];
};
export const getSingleThemeComponentLocal = async (webPageID: string, pageID: number, themeIdentifier: string): Promise<IRenderingComponentData> => {
  const themeLocal = await PageRenderingComponentModel.findOne(
    { webPageID, pageID, 'themeComponents.themeOption.themeIdentifier': themeIdentifier },
    { 'themeComponents.$': 1 },
  ).exec();
  return themeLocal?.themeComponents[0];
};
export const getThemeComponentsSharing = async (pageID: number): Promise<IRenderingComponentData[]> => {
  const themeComponents = await ThemeComponentModel.findOne({ pageID, 'themeComponents.isActive': true }).lean();
  if (themeComponents === null) {
    return [];
  }
  themeComponents.themeComponents = themeComponents.themeComponents.filter((component) => component.isActive === true);
  return themeComponents.themeComponents;
};
export const getSingleThemeComponentSharing = async (pageID: number, themeIdentifier: string): Promise<IRenderingComponentData> => {
  const themeSharing = await ThemeComponentModel.findOne({ pageID, 'themeComponents.themeOption.themeIdentifier': themeIdentifier }, { 'themeComponents.$': 1 }).exec();
  return themeSharing?.themeComponents[0];
};

export const getThemeComponentsGlobal = async (themeID: string, themeLayoutIndex: number): Promise<IRenderingComponentData[]> => {
  const themeGlobal = await Theme.findOne({ _id: themeID }).lean();
  return themeGlobal?.themeComponents[themeLayoutIndex].themeComponent ? themeGlobal?.themeComponents[themeLayoutIndex].themeComponent : [];
};
export const getAllThemeComponentsGlobal = async (themeID: string): Promise<IThemeRendering> => {
  const themeGlobal = await Theme.findOne({ _id: themeID }).lean();
  return themeGlobal;
};

export const getSingleThemeComponentGlobal = async (themeID: string, themeIdentifier: string): Promise<IRenderingComponentData[]> => {
  const themeGlobal = await Theme.findOne({ _id: themeID, 'themeComponents.themeComponent.themeOption.themeIdentifier': themeIdentifier }).exec();
  const components = themeGlobal?.themeComponents[0].themeComponent;
  return components;
};
export async function updateThumnailByIndex(updateThumbnail: IUpdateThumnail): Promise<IHTTPResult> {
  const mockData = await Theme.findOne({ _id: updateThumbnail._id }).lean();
  mockData.html[updateThumbnail.index].thumbnail = updateThumbnail.thumbnail;
  const result = await Theme.updateOne({ _id: updateThumbnail._id }, { $set: { html: mockData.html } });
  if (result) return { status: 200, value: updateThumbnail.thumbnail?.path };
  else return { status: 404, value: 'cannot save' };
}
export async function createThemeLayoutHtmlFile(_id: string): Promise<IHTTPResult> {
  const mockData = await Theme.findOne({ _id });
  const defaultHtml = {
    name: `Index${mockData.html.length}.html`,
    html: `<section id="THEME_HEADER" ></section>
<section id="CONTENT"></section>
<section id="THEME_FOOTER"></section>`,
    thumbnail: {
      path: null,
      stream: null,
    },
  };
  mockData.html.push(defaultHtml);
  const component = [] as IRenderingComponentData[];
  const themecomponent = { themeComponent: component };
  mockData.themeComponents.push(themecomponent);
  const saveResult = await mockData.save();
  if (saveResult) return { status: 200, value: 'save complete' };
  else return { status: 404, value: 'ERROR' };
}
