import { Component, OnInit } from '@angular/core';
import { ContentContentModel, ContentContentStatus } from './content-content.model';

@Component({
  selector: 'cms-next-content-content',
  templateUrl: './content-content.component.html',
  styleUrls: ['./content-content.component.scss'],
})
export class ContentContentComponent implements OnInit {
  contentContentData = [
    {
      title: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
      category: 'Category content',
      createdDate: '15/05/2020 20:35',
      status: ContentContentStatus.PUBLISH,
      imgUrl: 'assets/images/shared/sample.jpg',
    },
    {
      title: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
      category: 'Category content',
      createdDate: '15/05/2020 20:35',
      status: ContentContentStatus.HIDE,
      imgUrl: 'assets/images/shared/sample.jpg',
    },
    {
      title: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
      category: 'Category content',
      createdDate: '15/05/2020 20:35',
      status: ContentContentStatus.HIDE,
      imgUrl: null,
    },
    {
      title: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
      category: 'Category content',
      createdDate: '15/05/2020 20:35',
      status: ContentContentStatus.HIDE,
      imgUrl: 'assets/images/shared/sample.jpg',
    },
    {
      title: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
      category: 'Category content',
      createdDate: '15/05/2020 20:35',
      status: ContentContentStatus.HIDE,
      imgUrl: null,
    },
    {
      title: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
      category: 'Category content',
      createdDate: '15/05/2020 20:35',
      status: ContentContentStatus.HIDE,
      imgUrl: null,
    },
  ] as ContentContentModel[];

  constructor() {}

  ngOnInit(): void {}

  trackByIndex(index: number): number {
    return index;
  }
}
