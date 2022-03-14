import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-seo',
  templateUrl: './seo.component.html',
  styleUrls: ['./seo.component.scss'],
})
export class SeoComponent implements OnInit {
  seo = [
    {
      title: 'Page',
      img: 'assets/seo/page.svg',
      currentScore: 189,
      score: 200,
    },
    {
      title: 'Image',
      img: 'assets/seo/image.svg',
      currentScore: 50,
      score: 70,
    },
  ];
  constructor() {}

  ngOnInit(): void {}

  trackByIndex(index: number): number {
    return index;
  }
}
