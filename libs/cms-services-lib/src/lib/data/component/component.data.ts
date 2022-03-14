import { IContentManagementLanding, IMockPageComponent, IPageComponent, IRenderingComponentData } from '@reactor-room/cms-models-lib';
import { PageRenderingComponentMocksModel, PageRenderingComponentModel } from '@reactor-room/cms-model-mongo-lib';
import { ClientSession } from 'mongoose';
import * as mongoose from 'mongoose';

export const getComponent = async (webPageID: string, pageID: number): Promise<IPageComponent> => {
  const components = await PageRenderingComponentModel.aggregate([
    { $match: { webPageID: mongoose.Types.ObjectId(webPageID), pageID } },
    {
      $project: {
        webPageID: 1,
        pageID: 1,
        startID: 1,
        components: {
          $filter: {
            input: '$components',
            as: 'component',
            cond: {
              $in: ['$$component.isActive', [true]],
            },
          },
        },
      },
    },
  ]).exec();
  if (components) {
    return components[0];
  }
  return null;
};

export const getSingleComponent = async (webPageID: string, pageID: number, componentId: string): Promise<IRenderingComponentData> => {
  const componentData = await PageRenderingComponentModel.findOne({ webPageID, pageID, 'components._id': componentId }, { 'components.$': 1 }).exec();
  return componentData?.components[0];
};

export const getPageComponnetData = async (pageID: number): Promise<IPageComponent[]> => {
  const components = await PageRenderingComponentModel.aggregate([
    { $match: { pageID } },
    {
      $project: {
        webPageID: 1,
        pageID: 1,
        startID: 1,
        components: {
          $filter: {
            input: '$components',
            as: 'component',
            cond: {
              $in: ['$$component.isActive', [true]],
            },
          },
        },
      },
    },
  ]).exec();
  if (components) {
    return components;
  }
  return null;
};
export const getPageComponnetDataMock = async (userID: number, webPageID: string): Promise<IMockPageComponent> => {
  return await PageRenderingComponentMocksModel.findOne({ userID, webPageID });
};
export const savePageComponnetDataMock = async (pageComponents: IMockPageComponent[]): Promise<boolean> => {
  const saveResult = await PageRenderingComponentMocksModel.insertMany(pageComponents);
  if (saveResult) return true;
  else throw new Error('savePageComponnetDataMock');
};
export const deletePageComponnetDataMock = async (userID: number): Promise<boolean> => {
  const saveResult = await PageRenderingComponentMocksModel.deleteMany({ userID });
  if (saveResult) return true;
  else throw new Error('deletePageComponnetDataMock');
};

export const createPageComponent = async (webPageID: string, pageID: number, session: ClientSession): Promise<boolean> => {
  const pageComponents = { _id: mongoose.Types.ObjectId(), webPageID, pageID, startID: null, components: [], themeComponents: [] };
  const mockData = new PageRenderingComponentModel(pageComponents);
  const saveResult = await mockData.save({ session });
  if (saveResult) return true;
  else return false;
};

export const updateLinkedListPageComponent = async (components: IRenderingComponentData[], webPageID: string, pageID: number, session: ClientSession): Promise<void> => {
  const query = { webPageID, pageID };
  const update = {
    $set: {
      components: components,
    },
  };
  await PageRenderingComponentModel.updateOne(query, update).session(session);
};
export const updateStartID = async (_id: string, webPageID: string, pageID: number, session: ClientSession): Promise<boolean> => {
  const query = { webPageID, pageID };
  const update = {
    $set: {
      startID: _id,
    },
  };
  const saveResult = await PageRenderingComponentModel.updateOne(query, update).session(session);
  if (saveResult) return true;
  else throw new Error('updateStartID');
};

export const addPageComponent = async (pageComponents: IRenderingComponentData, webPageID: string, pageID: number, session: ClientSession): Promise<boolean> => {
  const { componentType, commonSettings, options, layoutID, layoutPosition, _id } = pageComponents;
  const query = { webPageID, pageID };
  const update = {
    $push: {
      components: {
        _id: _id,
        componentType: componentType,
        commonSettings: commonSettings,
        options: options,
        layoutID: layoutID,
        layoutPosition: layoutPosition,
        isActive: true,
      },
    },
  };
  const saveResult = await PageRenderingComponentModel.updateOne(query, update).session(session);
  if (saveResult) return true;
  else throw new Error('addPageComponent');
};

export const removePageComponent = async (_id: string, webPageID: string, pageID: number, session: ClientSession): Promise<boolean> => {
  const saveResult = await PageRenderingComponentModel.updateOne(
    { webPageID, pageID },
    {
      $pull: {
        components: {
          _id,
        },
      },
    },
  ).session(session);
  if (saveResult) return true;
  else throw new Error('removePageComponent');
};

export const updatePageComponent = async (pageComponents: IRenderingComponentData, webPageID: string, pageID: number, session: ClientSession): Promise<boolean> => {
  const { _id, componentType, commonSettings, options, layoutID, layoutPosition } = pageComponents;
  const saveResult = await PageRenderingComponentModel.updateOne(
    { webPageID, pageID, 'components._id': _id },
    {
      $set: {
        'components.$.componentType': componentType,
        'components.$.commonSettings': commonSettings,
        'components.$.options': options,
        'components.$.layoutID': layoutID,
        'components.$.layoutPosition': layoutPosition,
      },
    },
  ).session(session);
  if (saveResult) return true;
  else throw new Error('addPageComponent');
};

export const updateComponentLandingPageOption = async (landing: IContentManagementLanding, webPageID: string, componentId: string, pageID: number): Promise<boolean> => {
  const saveResult = await PageRenderingComponentModel.updateOne(
    { webPageID, pageID, 'components._id': componentId },
    {
      $set: {
        'components.$.options.landing': landing,
      },
    },
  ).exec();
  if (saveResult) return true;
  else throw new Error('updatePreviousLandingPageComponent');
};

export const updateLastIdComponentToLinkedList = async (_id: string, webPageID: string, pageID: number, session: ClientSession): Promise<boolean> => {
  await PageRenderingComponentModel.updateOne(
    { webPageID, pageID, 'components._id': _id },
    {
      $set: {
        'components.$.nextId': null,
      },
    },
  ).session(session);
  return true;
};

export const movePageComponent = async (pageComponent: IRenderingComponentData, webPageID: string, pageID: number, session: ClientSession): Promise<boolean> => {
  const { _id } = pageComponent;
  const saveResult = await PageRenderingComponentModel.updateOne(
    { webPageID, pageID, 'components._id': pageComponent.prevId },
    {
      $set: {
        'components.$.nextId': _id,
      },
    },
  ).session(session);
  if (saveResult) return true;
  else throw new Error('addPageComponent');
};

export const removeSampleComponent = async (webPageID: string): Promise<boolean> => {
  const removeResult = await PageRenderingComponentModel.remove({ webPageID });
  if (removeResult) return true;
  else return false;
};
