// import { ITemplateRenderingSetting } from '@reactor-room/cms-models-lib';

// export enum htmlTagNamesType {
//   CMS_NEXT_CMS_TEMPLATE_RENDERING = 'cms-next-cms-template-rendering',
//   CMS_NEXT_CMS_LAYOUT_RENDERING = 'cms-next-cms-layout-rendering',
//   CMS_NEXT_CMS_CONTAINER_RENDERING = 'cms-next-cms-container-rendering',
//   CMS_NEXT_CMS_TEXT_RENDERING = 'cms-next-cms-text-rendering',
// }

// export interface IRenderingComponentData {
//   id: string;
//   htmlTagName: htmlTagNamesType;
//   inlineStyle?: string;
//   customStyle?: string;
//   attributes?: {
//     column?: number;
//     borderColor?: string;
//     borderOpacity?: number;
//     isShadow?: boolean;
//     shadowColor?: string;
//     shadowOpacity?: number;
//     shadowXAxis?: number;
//     shadowYAxis?: number;
//     shadowDistance?: number;
//     shadowBlur?: number;
//     alignHorizontal?: string;
//     alignVertical?: string;
//     backgroundCurrent?: string;
//     backgroundSetting?: IBackgroundSetting;
//   };
//   renderingSetting?: ITextRenderingSetting | ILayoutRenderingSetting | ITemplateRenderingSetting;
// }

// export interface ITextRenderingSetting {
//   hoverStyle?: string;
//   quillHTMLNative?: string;
// }

// export interface ILayoutRenderingSetting {
//   columnGrid?: string;
//   columnGap?: number;
// }

// export interface IContainer {
//   id: string;
//   inlineStyle?: string;
//   customStyle?: string;
//   attributes: {
//     borderColor?: string;
//     borderOpacity?: number;
//     isShadow?: boolean;
//     shadowOpacity?: number;
//     shadowXAxis?: number;
//     shadowYAxis?: number;
//     shadowDistance?: number;
//     shadowBlur?: string;
//     alignHorizontal?: string;
//     alignVertical?: string;
//     backgroundCurrent?: string;
//     backgroundSetting?: IBackgroundSetting;
//   };
// }

// export type IBackgroundSetting = IBackgroundColor | IBackgroundImage | IBackgroundVideo;

// export interface IBackgroundColor {
//   backgroundColor?: string;
//   backgroundColorOpacity?: number;
// }

// export interface IBackgroundVideo {
//   backgroundVideoURL?: string;
//   backgroundVideoPosition?: string;
//   backgroundVideoLoop?: boolean;
//   backgroundVideoSpeed?: number;
//   backgroundVideoScale?: string;
//   backgroundVideoOpacity?: number;
//   backgroundVideoColorOverlay?: string;
//   backgroundVideoColorOverlayOpacity?: number;
//   backgroundVideoWidth?: string;
//   backgroundVideoHeight?: number;
// }

// export interface IBackgroundImage {
//   backgroundImageURL?: string;
//   backgroundImagePosition?: string;
//   backgroundImageScale?: string;
//   backgroundImageOpacity?: number;
//   backgroundImageColorOverlay?: string;
//   backgroundImageColorOverlayOpacity?: number;
//   backgroundImageWidth?: number;
//   backgroundImageHeight?: number;
//   backgroundImageRepeat?: boolean;
// }
