import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-home-storage',
  templateUrl: './home-storage.component.html',
  styleUrls: ['./home-storage.component.scss'],
})
export class HomeStorageComponent implements OnInit {
  progressBarData = [
    {
      title: 'Image',
      color: '#2FC639',
      value: 0.4,
    },
    {
      title: 'Video',
      color: '#FC8318',
      value: 0.2,
    },
  ];

  constructor() {}

  ngOnInit(): void {}
  trackByIndex(index: number): number {
    return index;
  }
}
