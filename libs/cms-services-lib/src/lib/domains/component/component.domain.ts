import { ComponentTypeEnum, IMediaGalleryRenderingSetting, IRenderingComponentData } from '@reactor-room/cms-models-lib';
import { isEmpty, transformImageURlFormat, transformMediaLinkString } from '@reactor-room/itopplus-back-end-helpers';
import mongoose from 'mongoose';
import { hasColumn } from '../angularhtml';
export function createMappingIDtoMongooseObjectId(component: IRenderingComponentData, keys: { [key: string]: string }): { [key: string]: string } {
  if (/^element-/.test(component._id) || /^layout-/.test(component._id)) {
    const oldId = component._id;
    component._id = mongoose.Types.ObjectId().toHexString();
    keys[oldId] = component._id;
  }
  if (/^element-/.test(component.prevId) || /^layout-/.test(component.prevId)) {
    if (keys[component.prevId]) {
      component.prevId = keys[component.prevId];
    } else {
      const oldPrevId = component.prevId;
      component.prevId = mongoose.Types.ObjectId().toHexString();
      keys[oldPrevId] = component.prevId;
    }
  }
  if (/^element-/.test(component.layoutID) || /^layout-/.test(component.layoutID)) {
    if (keys[component.layoutID]) {
      component.layoutID = keys[component.layoutID];
    } else {
      const oldLayoutID = component.layoutID;
      component.layoutID = mongoose.Types.ObjectId().toHexString();
      keys[oldLayoutID] = component.layoutID;
    }
  }
  return keys;
}
export function mapIdtoMongooseObjectId(component: IRenderingComponentData, idMapping: { [key: string]: string }): void {
  if (/^element-/.test(component.prevId) || /^layout-/.test(component.prevId)) {
    component.prevId = idMapping[component.prevId];
  }
  if (/^element-/.test(component._id) || /^layout-/.test(component._id)) {
    component._id = idMapping[component._id];
  }
}
export function isStartComponent(component: IRenderingComponentData): boolean {
  return component.prevId === null;
}
export function generateStaticHTMLForPlainHtml(type: ComponentTypeEnum, component: IRenderingComponentData): string {
  let tag;
  switch (type) {
    case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_DIV_RENDERING:
      tag = 'div';
      break;
    case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_P_RENDERING:
      tag = 'p';
      break;
    case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_SPAN_RENDERING:
      tag = 'span';
      break;
    case ComponentTypeEnum.CMS_NEXT_CMS_PLAIN_IMG_RENDERING:
      tag = 'img';
      break;
  }
  const number = tag.length + 2;
  const indexSpace = component.outterHTML.indexOf(' ');
  const indexCloseTag = component.outterHTML.indexOf('>');
  let plainhtml;
  if (indexSpace === -1) {
    plainhtml = `<${tag}` + ` id="${component._id}"` + ` ${hasColumn(component.layoutPosition)}` + '>' + component.outterHTML.slice(number);
  } else if (indexSpace > indexCloseTag) {
    plainhtml = `<${tag}` + ` id="${component._id}"` + ` ${hasColumn(component.layoutPosition)}` + '>' + component.outterHTML.slice(indexSpace);
  } else {
    plainhtml = component.outterHTML.slice(0, indexSpace) + ` id="${component._id}"` + ` ${hasColumn(component.layoutPosition)}` + component.outterHTML.slice(indexSpace);
  }
  return plainhtml;
}
export function changeFullUrlToPathUrl(component: IRenderingComponentData): IRenderingComponentData {
  if (component) {
    switch (component.componentType) {
      case ComponentTypeEnum.CMS_NEXT_CMS_MEDIA_GALLERY_RENDERING:
        component.options = generatePathUrlMediaGallery(component.options as IMediaGalleryRenderingSetting);
    }
  }
  return component;
}
function generatePathUrlMediaGallery(options: IMediaGalleryRenderingSetting): IMediaGalleryRenderingSetting {
  if (!isEmpty(options?.gallery?.gallleryList)) {
    for (let i = 0; i < options.gallery.gallleryList.length; i++) {
      const url = options.gallery.gallleryList[i].url;
      const imgUrl = options.gallery.gallleryList[i].setting?.generalBackgroundSetting?.layoutSettingBackgroundImageForm?.imgUrl;
      if (url) {
        options.gallery.gallleryList[i].url = transformImageURlFormat(url);
      }
      if (imgUrl) {
        options.gallery.gallleryList[i].setting.generalBackgroundSetting.layoutSettingBackgroundImageForm.imgUrl = transformImageURlFormat(imgUrl);
      }
    }
  }
  return options;
}

export function changePathUrlToFullUrl(components: IRenderingComponentData[], fileServer: string, subscriptionID: string): IRenderingComponentData[] {
  for (let component of components) {
    if (component) {
      component = changeComponentPathUrlToFullUrl(component, fileServer, subscriptionID);
    }
  }
  return components;
}

export function changeComponentPathUrlToFullUrl(component: IRenderingComponentData, fileServer: string, subscriptionID: string): IRenderingComponentData {
  switch (component.componentType) {
    case ComponentTypeEnum.CMS_NEXT_CMS_MEDIA_GALLERY_RENDERING:
      component.options = generateFullUrlMediaGallery(component.options as IMediaGalleryRenderingSetting, fileServer, subscriptionID);
  }
  return component;
}

function generateFullUrlMediaGallery(options: IMediaGalleryRenderingSetting, fileServer: string, subscriptionID: string): IMediaGalleryRenderingSetting {
  if (!isEmpty(options?.gallery?.gallleryList)) {
    for (let i = 0; i < options.gallery.gallleryList.length; i++) {
      const url = options.gallery.gallleryList[i].url;
      const imgUrl = options.gallery.gallleryList[i].setting?.generalBackgroundSetting?.layoutSettingBackgroundImageForm?.imgUrl;
      if (url) {
        options.gallery.gallleryList[i].url = transformMediaLinkString(url, fileServer, subscriptionID, false);
      }
      if (imgUrl) {
        options.gallery.gallleryList[i].setting.generalBackgroundSetting.layoutSettingBackgroundImageForm.imgUrl = transformMediaLinkString(
          imgUrl,
          fileServer,
          subscriptionID,
          false,
        );
      }
    }
  }
  return options;
}
