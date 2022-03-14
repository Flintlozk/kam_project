import * as fs from 'fs';
import * as ejs from 'ejs';
import { EnumLanguageCultureUI, IGeneralText, IMediaGalleryList, IMediaGalleryRenderingSetting, IThemeDevice, MediaGalleryType } from '@reactor-room/cms-models-lib';
import { getDecodeWidth, isEmpty } from '@reactor-room/itopplus-back-end-helpers';
import { environmentLib } from '@reactor-room/environment-services-backend';

export function generateStaticHTMLMediaGallery(
  layoutOption: IMediaGalleryRenderingSetting,
  commonSettingsStyle: string,
  _id: string,
  cultureUI: EnumLanguageCultureUI,
  devices: IThemeDevice[],
  defaultCultureUI: EnumLanguageCultureUI,
): string {
  switch (layoutOption.gallery.galleryPatternId) {
    case MediaGalleryType.GALLERY_1: {
      return generateStaticHTMLMediaGallery1(layoutOption, commonSettingsStyle, _id, cultureUI, devices, defaultCultureUI);
    }
    case MediaGalleryType.GALLERY_2: {
      return generateStaticHTMLMediaGallery2(layoutOption, commonSettingsStyle, _id, cultureUI, devices, defaultCultureUI);
    }
    case MediaGalleryType.GALLERY_3: {
      return generateStaticHTMLMediaGallery3(layoutOption, commonSettingsStyle, _id, cultureUI, devices, defaultCultureUI);
    }
    case MediaGalleryType.GALLERY_4: {
      return generateStaticHTMLMediaGallery4(layoutOption, commonSettingsStyle, _id, cultureUI, devices, defaultCultureUI);
    }
    case MediaGalleryType.GALLERY_5: {
      return generateStaticHTMLMediaGallery5(layoutOption, commonSettingsStyle, _id, cultureUI, devices, defaultCultureUI);
    }
  }
}
export function generateStaticHTMLMediaGallery1(
  layoutOption: IMediaGalleryRenderingSetting,
  commonSettingsStyle: string,
  _id: string,
  cultureUI: EnumLanguageCultureUI,
  devices: IThemeDevice[],
  defaultCultureUI: EnumLanguageCultureUI,
): string {
  const mediaListHtml = generateStaticHTMLMedaiList(layoutOption.gallery.gallleryList, cultureUI, devices, defaultCultureUI);
  const galleryRendering = fs.readFileSync(__dirname + `/assets/media-gallery/ejs/${layoutOption.gallery.galleryPatternId.toLocaleLowerCase()}.ejs`);
  const html = ejs.render(galleryRendering.toString(), { mediaListHtml, mediaGallerySetting: layoutOption.gallery });
  const mediaGallery = `<div id="${_id}" style='${commonSettingsStyle}'>${html}</div>`;
  return mediaGallery;
}

export function generateStaticHTMLMediaGallery2(
  layoutOption: IMediaGalleryRenderingSetting,
  commonSettingsStyle: string,
  _id: string,
  cultureUI: EnumLanguageCultureUI,
  devices: IThemeDevice[],
  defaultCultureUI: EnumLanguageCultureUI,
): string {
  const mediaListHtml = generateStaticHTMLMedaiList(layoutOption.gallery.gallleryList, cultureUI, devices, defaultCultureUI);

  const galleryRendering = fs.readFileSync(__dirname + `/assets/media-gallery/ejs/${layoutOption.gallery.galleryPatternId.toLocaleLowerCase()}.ejs`);
  const html = ejs.render(galleryRendering.toString(), { mediaListHtml, mediaGallerySetting: layoutOption.gallery });
  const mediaGallery = `<div id="${_id}" style='${commonSettingsStyle}'>${html}</div>`;
  return mediaGallery;
}
export function generateStaticHTMLMediaGallery5(
  layoutOption: IMediaGalleryRenderingSetting,
  commonSettingsStyle: string,
  _id: string,
  cultureUI: EnumLanguageCultureUI,
  devices: IThemeDevice[],
  defaultCultureUI: EnumLanguageCultureUI,
): string {
  const mediaListHtml = generateStaticHTMLMedaiList(layoutOption.gallery.gallleryList, cultureUI, devices, defaultCultureUI);

  const galleryRendering = fs.readFileSync(__dirname + `/assets/media-gallery/ejs/${layoutOption.gallery.galleryPatternId.toLocaleLowerCase()}.ejs`);
  const html = ejs.render(galleryRendering.toString(), { mediaListHtml, mediaGallerySetting: layoutOption.gallery });
  const mediaGallery = `<div id="${_id}" style='${commonSettingsStyle}'>${html}</div>`;
  return mediaGallery;
}
export function generateStaticHTMLMediaGallery3(
  layoutOption: IMediaGalleryRenderingSetting,
  commonSettingsStyle: string,
  _id: string,
  cultureUI: EnumLanguageCultureUI,
  devices: IThemeDevice[],
  defaultCultureUI: EnumLanguageCultureUI,
): string {
  const mediaList1 = layoutOption.gallery.gallleryList[0];
  const mediaList2 = layoutOption.gallery.gallleryList.slice(1, 3);
  const mediaList3 = layoutOption.gallery.gallleryList.slice(3, 5);
  const mediaListHtml1 = generateStaticHTMLMedaiList([mediaList1], cultureUI, devices, defaultCultureUI);
  const mediaListHtml2 = generateStaticHTMLMedaiList(mediaList2, cultureUI, devices, defaultCultureUI);
  const mediaListHtml3 = generateStaticHTMLMedaiList(mediaList3, cultureUI, devices, defaultCultureUI);
  const galleryRendering = fs.readFileSync(__dirname + `/assets/media-gallery/ejs/${layoutOption.gallery.galleryPatternId.toLocaleLowerCase()}.ejs`);
  const html = ejs.render(galleryRendering.toString(), { mediaListHtml1, mediaListHtml2, mediaListHtml3, mediaGallerySetting: layoutOption.gallery });
  const mediaGallery = `<div id="${_id}" style='${commonSettingsStyle}'>${html}</div>`;
  return mediaGallery;
}
export function generateStaticHTMLMediaGallery4(
  layoutOption: IMediaGalleryRenderingSetting,
  commonSettingsStyle: string,
  _id: string,
  cultureUI: EnumLanguageCultureUI,
  devices: IThemeDevice[],
  defaultCultureUI: EnumLanguageCultureUI,
): string {
  const mediaList1 = layoutOption.gallery.gallleryList[0];
  const mediaList2 = layoutOption.gallery.gallleryList.slice(1, 3);
  const mediaList3 = layoutOption.gallery.gallleryList.slice(3, 5);
  const mediaListHtml1 = generateStaticHTMLMedaiList([mediaList1], cultureUI, devices, defaultCultureUI);
  const mediaListHtml2 = generateStaticHTMLMedaiList(mediaList2, cultureUI, devices, defaultCultureUI);
  const mediaListHtml3 = generateStaticHTMLMedaiList(mediaList3, cultureUI, devices, defaultCultureUI);
  const galleryRendering = fs.readFileSync(__dirname + `/assets/media-gallery/ejs/${layoutOption.gallery.galleryPatternId.toLocaleLowerCase()}.ejs`);
  const html = ejs.render(galleryRendering.toString(), { mediaListHtml1, mediaListHtml2, mediaListHtml3, mediaGallerySetting: layoutOption.gallery });
  const mediaGallery = `<div id="${_id}" style='${commonSettingsStyle}'>${html}</div>`;
  return mediaGallery;
}
export function generateStaticHTMLMedaiList(
  mediaGallleryList: IMediaGalleryList[],
  cultureUI: EnumLanguageCultureUI,
  devices: IThemeDevice[],
  defaultCultureUI: EnumLanguageCultureUI,
): string {
  let html = '';
  let imageSource = '';
  mediaGallleryList.forEach((media) => {
    let htmlText = '';
    if (media?.setting?.generalTextSetting) {
      htmlText = generateStaticHTMLGeneralText(media?.setting?.generalTextSetting, cultureUI, defaultCultureUI);
    }
    imageSource = generateStaticHTMLImgSource(media.url, devices);
    const mediaRednering = fs.readFileSync(__dirname + `/assets/media-gallery/ejs/${media.fileType.toLocaleLowerCase()}.ejs`);
    html += ejs.render(mediaRednering.toString(), { media, htmlText, imageSource });
  });
  return html;
}

export function generateStaticHTMLGeneralText(generalText: IGeneralText, cultureUI: EnumLanguageCultureUI, defaultCultureUI: EnumLanguageCultureUI): string {
  let html = '';
  const textRendering = fs.readFileSync(__dirname + `/assets/media-gallery/ejs/text.ejs`);
  let text = generalText.text.text.find((text) => text.cultureUI === cultureUI);
  if (isEmpty(text)) {
    text = generalText.text.text.find((text) => text.cultureUI === defaultCultureUI);
  }
  html = ejs.render(textRendering.toString(), { generalText, text });
  return html;
}

export function generateStaticHTMLImgSource(url: string, devices: IThemeDevice[]) {
  const resolutions = devices.map((device) => device.minwidth);
  let imgeSource = '';
  const extension = url.substring(url.search(/\./), url.length);
  const resizeUrl = url.replace(environmentLib.filesServer, environmentLib.filesServer + 'resize/');
  resolutions.sort(function (a, b) {
    return a - b;
  });
  for (const resolution of resolutions) {
    const query = getDecodeWidth(resolution, environmentLib.pageKey);
    imgeSource += `<source type="image/webp" media=(max-width:${resolution}px) srcset="${resizeUrl.replace(extension, '.webp') + query}" >`;
  }
  return imgeSource;
}
