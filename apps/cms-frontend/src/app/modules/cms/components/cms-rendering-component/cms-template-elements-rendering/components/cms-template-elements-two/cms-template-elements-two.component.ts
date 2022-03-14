import { Component, OnInit } from '@angular/core';
import { ComponentTypeEnum, ELayoutColumns, ICommonSettings, ILayoutRenderingSetting, IRenderingComponentData, ITextRenderingSetting } from '@reactor-room/cms-models-lib';
import { CmsCommonService } from '../../../../../services/cms-common.service';

@Component({
  selector: 'cms-next-cms-template-elements-two',
  templateUrl: './cms-template-elements-two.component.html',
  styleUrls: ['./cms-template-elements-two.component.scss'],
})
export class CmsThemeElementsTwoComponent implements OnInit {
  layoutData: IRenderingComponentData = {
    _id: 'layout-1',
    componentType: ComponentTypeEnum.CMS_NEXT_CMS_LAYOUT_RENDERING,
    commonSettings: {
      border: {
        corner: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
        color: '#414042',
        opacity: 100,
        thickness: 2,
        position: { left: true, top: true, right: true, bottom: true },
      },
      shadow: { isShadow: true, color: '', opacity: 90, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
      effect: { scrollEffect: '', xAxis: 0, yAxis: 0, isStretch: true, margin: 0 },
      advance: {
        margin: { left: 0, top: 0, right: 0, bottom: 0 },
        padding: { left: 70, top: 20, right: 70, bottom: 20 },
        horizontalPosition: 'flex-start',
        verticalPosition: 'flex-start',
      },
      background: {
        currentStyle: 'COLOR',
        layoutSettingBackgroundColorForm: { color: '#E5E6EB', opacity: 100 },
        layoutSettingBackgroundImageForm: {
          imgUrl: '',
          position: 'center center',
          imageScale: 'unset',
          opacity: 100,
          colorOverlay: '',
          colorOverlayOpacity: 100,
          width: null,
          height: null,
          repeat: false,
        },
        layoutSettingBackgroundVideoForm: {
          videoUrl: '',
          position: 'center center',
          playInLoop: false,
          videoSpeed: 1,
          videoScale: 'unset',
          opacity: 100,
          colorOverlay: '',
          colorOverlayOpacity: 100,
          width: null,
          height: null,
        },
      },
      customize: {
        cssStyle: '#layout-1{}',
        elementId: 'layout-1',
      },
      hover: {
        style: '',
        textHover: '',
      },
    },
    options: {
      setting: {
        column: ELayoutColumns.THREE_COLUMN,
        gap: 10,
      },
    } as ILayoutRenderingSetting,
    orderNumber: 0,
    layoutID: null,
    layoutPosition: null,
    isActive: true,
  };

  textData: IRenderingComponentData = {
    _id: 'text-1',
    componentType: ComponentTypeEnum.CMS_NEXT_CMS_TEXT_RENDERING,
    commonSettings: {
      border: {
        corner: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
        color: '',
        opacity: 100,
        thickness: 0,
        position: { left: false, top: false, right: false, bottom: false },
      },
      shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
      effect: { scrollEffect: '', xAxis: 0, yAxis: 0, isStretch: false, margin: 0 },
      advance: {
        margin: { left: 0, top: 0, right: 0, bottom: 0 },
        padding: { left: 20, top: 20, right: 20, bottom: 20 },
        horizontalPosition: 'flex-start',
        verticalPosition: 'flex-start',
      },
      background: {
        currentStyle: 'COLOR',
        layoutSettingBackgroundColorForm: { color: '', opacity: 100 },
        layoutSettingBackgroundImageForm: {
          imgUrl: '',
          position: 'center center',
          imageScale: 'unset',
          opacity: 100,
          colorOverlay: '',
          colorOverlayOpacity: 100,
          width: null,
          height: null,
          repeat: false,
        },
        layoutSettingBackgroundVideoForm: {
          videoUrl: '',
          position: 'center center',
          playInLoop: false,
          videoSpeed: 1,
          videoScale: 'unset',
          opacity: 100,
          colorOverlay: '',
          colorOverlayOpacity: 100,
          width: null,
          height: null,
        },
      },
      customize: {
        cssStyle: '#text-1{}',
        elementId: 'text-1',
      },
      hover: {
        style: '',
        textHover: '',
      },
    },
    options: {
      quillHTMLs: [
        {
          cultureUI: this.cmsCommonService.defaultCultureUI,
          quillHTML:
            '<p><span class="ql-font-racing" style="color: rgb(0, 0, 0); font-size: 18px;">Loream</span></p><p><span class="ql-font-racing" style="color: rgb(0, 0, 0); font-size: 14px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id accumsan, id vitae amet, varius. Id amet aliquam penatibus eget pellentesque est </span></p>',
        },
      ],
    } as ITextRenderingSetting,
    orderNumber: 1,
    layoutID: null,
    layoutPosition: null,
    isActive: true,
  };

  containerSettings: ICommonSettings[] = [
    {
      border: {
        corner: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
        color: '',
        opacity: 100,
        thickness: 0,
        position: { left: false, top: false, right: false, bottom: false },
      },
      shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
      effect: { scrollEffect: '', xAxis: 0, yAxis: 0, isStretch: false, margin: 0 },
      advance: {
        margin: { left: 0, top: 0, right: 0, bottom: 0 },
        padding: { left: 20, top: 20, right: 20, bottom: 20 },
        horizontalPosition: 'flex-start',
        verticalPosition: 'flex-start',
      },
      background: {
        currentStyle: 'COLOR',
        layoutSettingBackgroundColorForm: { color: '', opacity: 100 },
        layoutSettingBackgroundImageForm: {
          imgUrl: '',
          position: 'center center',
          imageScale: 'unset',
          opacity: 100,
          colorOverlay: '',
          colorOverlayOpacity: 100,
          width: null,
          height: null,
          repeat: false,
        },
        layoutSettingBackgroundVideoForm: {
          videoUrl: '',
          position: 'center center',
          playInLoop: false,
          videoSpeed: 1,
          videoScale: 'unset',
          opacity: 100,
          colorOverlay: '',
          colorOverlayOpacity: 100,
          width: null,
          height: null,
        },
      },
      customize: {
        cssStyle: '#layout-1-container-1{}',
        elementId: 'layout-1-container-1',
      },
      hover: {
        style: '',
        textHover: '',
      },
    },
    {
      border: {
        corner: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
        color: '',
        opacity: 100,
        thickness: 0,
        position: { left: false, top: false, right: false, bottom: false },
      },
      shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
      effect: { scrollEffect: '', xAxis: 0, yAxis: 0, isStretch: false, margin: 0 },
      advance: {
        margin: { left: 0, top: 0, right: 0, bottom: 0 },
        padding: { left: 20, top: 20, right: 20, bottom: 20 },
        horizontalPosition: 'flex-start',
        verticalPosition: 'flex-start',
      },
      background: {
        currentStyle: 'COLOR',
        layoutSettingBackgroundColorForm: { color: '', opacity: 100 },
        layoutSettingBackgroundImageForm: {
          imgUrl: '',
          position: 'center center',
          imageScale: 'unset',
          opacity: 100,
          colorOverlay: '',
          colorOverlayOpacity: 100,
          width: null,
          height: null,
          repeat: false,
        },
        layoutSettingBackgroundVideoForm: {
          videoUrl: '',
          position: 'center center',
          playInLoop: false,
          videoSpeed: 1,
          videoScale: 'unset',
          opacity: 100,
          colorOverlay: '',
          colorOverlayOpacity: 100,
          width: null,
          height: null,
        },
      },
      customize: {
        cssStyle: '#layout-1-container-1{}',
        elementId: 'layout-1-container-1',
      },
      hover: {
        style: '',
        textHover: '',
      },
    },
    {
      border: {
        corner: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
        color: '',
        opacity: 100,
        thickness: 0,
        position: { left: false, top: false, right: false, bottom: false },
      },
      shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
      effect: { scrollEffect: '', xAxis: 0, yAxis: 0, isStretch: false, margin: 0 },
      advance: {
        margin: { left: 0, top: 0, right: 0, bottom: 0 },
        padding: { left: 20, top: 20, right: 20, bottom: 20 },
        horizontalPosition: 'flex-start',
        verticalPosition: 'flex-start',
      },
      background: {
        currentStyle: 'COLOR',
        layoutSettingBackgroundColorForm: { color: '', opacity: 100 },
        layoutSettingBackgroundImageForm: {
          imgUrl: '',
          position: 'center center',
          imageScale: 'unset',
          opacity: 100,
          colorOverlay: '',
          colorOverlayOpacity: 100,
          width: null,
          height: null,
          repeat: false,
        },
        layoutSettingBackgroundVideoForm: {
          videoUrl: '',
          position: 'center center',
          playInLoop: false,
          videoSpeed: 1,
          videoScale: 'unset',
          opacity: 100,
          colorOverlay: '',
          colorOverlayOpacity: 100,
          width: null,
          height: null,
        },
      },
      customize: {
        cssStyle: '#layout-1-container-1{}',
        elementId: 'layout-1-container-1',
      },
      hover: {
        style: '',
        textHover: '',
      },
    },
    {
      border: {
        corner: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
        color: '',
        opacity: 100,
        thickness: 0,
        position: { left: false, top: false, right: false, bottom: false },
      },
      shadow: { isShadow: false, color: '', opacity: 100, xAxis: 0, yAxis: 0, distance: 0, blur: 0 },
      effect: { scrollEffect: '', xAxis: 0, yAxis: 0, isStretch: false, margin: 0 },
      advance: {
        margin: { left: 0, top: 0, right: 0, bottom: 0 },
        padding: { left: 20, top: 20, right: 20, bottom: 20 },
        horizontalPosition: 'flex-start',
        verticalPosition: 'flex-start',
      },
      background: {
        currentStyle: 'COLOR',
        layoutSettingBackgroundColorForm: { color: '', opacity: 100 },
        layoutSettingBackgroundImageForm: {
          imgUrl: '',
          position: 'center center',
          imageScale: 'unset',
          opacity: 100,
          colorOverlay: '',
          colorOverlayOpacity: 100,
          width: null,
          height: null,
          repeat: false,
        },
        layoutSettingBackgroundVideoForm: {
          videoUrl: '',
          position: 'center center',
          playInLoop: false,
          videoSpeed: 1,
          videoScale: 'unset',
          opacity: 100,
          colorOverlay: '',
          colorOverlayOpacity: 100,
          width: null,
          height: null,
        },
      },
      customize: {
        cssStyle: '#layout-1-container-1{}',
        elementId: 'layout-1-container-1',
      },
      hover: {
        style: '',
        textHover: '',
      },
    },
  ];
  constructor(private cmsCommonService: CmsCommonService) {}

  ngOnInit(): void {}
}
