import { IMockPageComponent, IPageComponent } from '@reactor-room/cms-models-lib';
import mongoose, { Schema, Document } from 'mongoose';

//#region CommonSettings
const LayoutSettingBorderCornerSchema = new Schema({
  topLeft: Number,
  topRight: Number,
  bottomLeft: Number,
  bottomRight: Number,
});

const LayoutSettingBorderPositionSchema = new Schema({
  left: Boolean,
  top: Boolean,
  right: Boolean,
  bottom: Boolean,
});

const LayoutSettingBorderSchema = new Schema({
  corner: LayoutSettingBorderCornerSchema,
  color: String,
  opacity: Number,
  thickness: Number,
  position: LayoutSettingBorderPositionSchema,
});

const LayoutSettingShadowSchema = new Schema({
  isShadow: Boolean,
  color: String,
  opacity: Number,
  xAxis: Number,
  yAxis: Number,
  distance: Number,
  blur: Number,
});

const LayoutSettingHoverSchema = new Schema({
  style: String,
  textHover: String,
});

const LayoutDesignEffectSchema = new Schema({
  scrollEffect: String,
  xAxis: Number,
  yAxis: Number,
  isStretch: Boolean,
  margin: Number,
});

const LayoutSettingBackgroundColorSchema = new Schema({
  color: String,
  opacity: Number,
});

const LayoutSettingBackgroundImageSchema = new Schema({
  imgUrl: String,
  position: String,
  imageScale: String,
  opacity: Number,
  colorOverlay: String,
  colorOverlayOpacity: Number,
  width: Number,
  height: Number,
  repeat: Boolean,
});
const LayoutSettingBackgroundVideoSchema = new Schema({
  videoUrl: String,
  position: String,
  playInLoop: Boolean,
  videoSpeed: Number,
  videoScale: String,
  opacity: Number,
  colorOverlay: String,
  colorOverlayOpacity: Number,
  width: Number,
  height: Number,
});

const LayoutSettingBackgroundSchema = new Schema({
  currentStyle: String,
  layoutSettingBackgroundColorForm: LayoutSettingBackgroundColorSchema,
  layoutSettingBackgroundImageForm: LayoutSettingBackgroundImageSchema,
  layoutSettingBackgroundVideoForm: LayoutSettingBackgroundVideoSchema,
});

const LayoutSettingAdvanceDetailSchema = new Schema({
  left: Number,
  top: Number,
  right: Number,
  bottom: Number,
});

const LayoutSettingAdvanceSchema = new Schema({
  margin: LayoutSettingAdvanceDetailSchema,
  padding: LayoutSettingAdvanceDetailSchema,
  horizontalPosition: String,
  verticalPosition: String,
});

const LayoutSettingCustomizeSchema = new Schema({
  cssStyle: String,
  elementId: String,
});
//#endregion

export const CommonSettingsSchema = new Schema({
  border: LayoutSettingBorderSchema,
  shadow: LayoutSettingShadowSchema,
  hover: LayoutSettingHoverSchema,
  effect: LayoutDesignEffectSchema,
  background: LayoutSettingBackgroundSchema,
  advance: LayoutSettingAdvanceSchema,
  customize: LayoutSettingCustomizeSchema,
  className: String,
});

export const RenderingComponentDataSchema = new Schema({
  _id: Schema.Types.ObjectId,
  themeOption: {
    themeIdentifier: String,
  },
  componentType: String,
  section: String,
  outterHTML: String,
  commonSettings: CommonSettingsSchema,
  options: Schema.Types.Mixed,
  orderNumber: Number,
  layoutID: {
    type: Schema.Types.ObjectId,
    index: true,
  },
  themeLayoutID: String,
  layoutPosition: Number,
  isActive: {
    type: Boolean,
    default: true,
  },
  nextId: String,
});
const PAGE_COMPONENTS_SCHEMA = new Schema({
  _id: Schema.Types.ObjectId,
  components: [RenderingComponentDataSchema],
  themeComponents: [RenderingComponentDataSchema],
  pageID: Number,
  webPageID: {
    type: Schema.Types.ObjectId,
    index: true,
  },
  startID: Schema.Types.ObjectId,
});
export const PageRenderingComponentModel = mongoose?.model<IPageComponent & Document>('z_cms_page_components', PAGE_COMPONENTS_SCHEMA);

export const PageRenderingComponentMocksModel = mongoose?.model<IMockPageComponent & Document>(
  'z_cms_page_components_mocks',
  PAGE_COMPONENTS_SCHEMA.add({ subscriptionID: String, userID: Number }),
);
