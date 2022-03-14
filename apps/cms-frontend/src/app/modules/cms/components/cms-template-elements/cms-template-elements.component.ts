import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ThemeElementsType } from '@reactor-room/cms-models-lib';
import { ECmsThemeTypes, ICmsThemeElement, ICmsThemeElementTab } from './cms-template-elements.model';

@Component({
  selector: 'cms-next-cms-template-elements',
  templateUrl: './cms-template-elements.component.html',
  styleUrls: ['./cms-template-elements.component.scss'],
})
export class CmsTemplateElementsComponent implements OnInit {
  preImgUrl = 'assets/themes/element/';
  CmsThemeIds = ThemeElementsType;
  cmsThemeElements: ICmsThemeElement[] = [
    {
      templateId: ThemeElementsType.TEMPLATE_1,
      image: this.preImgUrl + 'element_1.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_2,
      image: this.preImgUrl + 'element_2.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_3,
      image: this.preImgUrl + 'element_3.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_4,
      image: this.preImgUrl + 'element_4.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_5,
      image: this.preImgUrl + 'element_5.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_6,
      image: this.preImgUrl + 'element_6.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_7,
      image: this.preImgUrl + 'element_7.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_8,
      image: this.preImgUrl + 'element_8.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_9,
      image: this.preImgUrl + 'element_9.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_10,
      image: this.preImgUrl + 'element_10.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_11,
      image: this.preImgUrl + 'element_11.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_12,
      image: this.preImgUrl + 'element_12.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_13,
      image: this.preImgUrl + 'element_13.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_14,
      image: this.preImgUrl + 'element_14.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_15,
      image: this.preImgUrl + 'element_15.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_16,
      image: this.preImgUrl + 'element_16.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_17,
      image: this.preImgUrl + 'element_17.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_18,
      image: this.preImgUrl + 'element_18.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_19,
      image: this.preImgUrl + 'element_19.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
    {
      templateId: ThemeElementsType.TEMPLATE_20,
      image: this.preImgUrl + 'element_20.png',
      elementTypes: [ECmsThemeTypes.GALLERY],
    },
  ];
  cmsThemeTab: ICmsThemeElementTab[] = [
    {
      title: 'All',
      status: true,
      key: null,
    },
    {
      title: ECmsThemeTypes.HEADER,
      status: false,
      key: ECmsThemeTypes.HEADER,
    },
    {
      title: ECmsThemeTypes.TEXT,
      status: false,
      key: ECmsThemeTypes.TEXT,
    },
    {
      title: ECmsThemeTypes.MEDIA,
      status: false,
      key: ECmsThemeTypes.MEDIA,
    },
    {
      title: ECmsThemeTypes.GALLERY,
      status: false,
      key: ECmsThemeTypes.GALLERY,
    },
    {
      title: ECmsThemeTypes.FOOTER,
      status: false,
      key: ECmsThemeTypes.FOOTER,
    },
  ];

  constructor(private dialogRef: MatDialogRef<CmsTemplateElementsComponent>) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  trackByIndex(index: number): number {
    return index;
  }

  onSelectThemeElement(index: number): void {
    this.dialogRef.close(this.cmsThemeElements[index].templateId);
  }

  onSelectCmsThemeTab(index: number): void {
    this.cmsThemeTab.forEach((tab) => (tab.status = false));
    this.cmsThemeTab[index].status = true;
  }
}
