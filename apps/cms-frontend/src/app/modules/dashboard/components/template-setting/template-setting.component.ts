import { Component, OnInit } from '@angular/core';
import { RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { IHeading } from '../../../../components/heading/heading.model';
import { ITemplate } from './template-setting.model';

@Component({
  selector: 'cms-next-template-setting',
  templateUrl: './template-setting.component.html',
  styleUrls: ['./template-setting.component.scss'],
})
export class TemplateSettingComponent implements OnInit {
  heading: IHeading = {
    title: 'Theme Setting',
    subTitle: 'Dashboard / Theme Setting',
  };

  currentTemplate: ITemplate;

  templateStyles = [
    {
      title: 'Style 1',
      value: 'style-1',
    },
    {
      title: 'Style 2',
      value: 'style-2',
    },
    {
      title: 'Style 3',
      value: 'style-3',
    },
  ];

  templates: ITemplate[] = [
    {
      id: '1',
      title: 'Theme 1',
      screenShot: 'assets/themes/theme-1.png',
      currentTemplate: true,
    },
    {
      id: '2',
      title: 'Theme 2',
      screenShot: 'assets/themes/theme-2.png',
      currentTemplate: false,
    },
    {
      id: '3',
      title: 'Theme 3',
      screenShot: 'assets/themes/theme-3.png',
      currentTemplate: false,
    },
    {
      id: '4',
      title: 'Theme 4',
      screenShot: 'assets/themes/theme-4.png',
      currentTemplate: false,
    },
    {
      id: '5',
      title: 'Theme 5',
      screenShot: 'assets/themes/theme-5.png',
      currentTemplate: false,
    },
    {
      id: '6',
      title: 'Theme 6',
      screenShot: 'assets/themes/theme-6.png',
      currentTemplate: false,
    },
  ];

  ERouteLink = RouteLinkEnum;

  constructor() {}

  ngOnInit(): void {
    this.currentTemplate = this.getCurrentTemplate();
  }

  trackByIndex(index: number): number {
    return index;
  }

  setCurrentTemplate(index: number): void {
    this.templates.forEach((template) => (template.currentTemplate = false));
    this.templates[index].currentTemplate = true;
    this.currentTemplate = this.templates[index];
  }

  getCurrentTemplate(): ITemplate {
    const currentTemplate = this.templates.find((template) => (template.currentTemplate = true));
    return currentTemplate;
  }
}
