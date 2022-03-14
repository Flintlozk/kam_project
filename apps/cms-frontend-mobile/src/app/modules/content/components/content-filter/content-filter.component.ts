import { Component, OnInit } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-content-filter',
  templateUrl: './content-filter.component.html',
  styleUrls: ['./content-filter.component.scss'],
  animations: [FadeAnimate.iconFade, FadeAnimate.fadeLeftAnimation],
})
export class ContentFilterComponent implements OnInit {
  contentFilterData = [
    {
      title: 'Draft',
      imgUrl: '/assets/images/content/draft.svg',
      imgActiveUrl: '/assets/images/content/draft-active.svg',
      routeLink: '/content/draft',
    },
    {
      title: 'Content',
      imgUrl: '/assets/images/content/content.svg',
      imgActiveUrl: '/assets/images/content/content-active.svg',
      routeLink: '/content/content',
    },
    {
      title: 'File Manage',
      imgUrl: '/assets/images/content/file-manage.svg',
      imgActiveUrl: '/assets/images/content/file-manage-active.svg',
      routeLink: '/content/file-manage',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
  trackByIndex(index: number): number {
    return index;
  }
}
