import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-content-content-edit',
  templateUrl: './content-content-edit.component.html',
  styleUrls: ['./content-content-edit.component.scss'],
})
export class ContentContentEditComponent implements OnInit {
  contentStatusData = [
    {
      value: 'publish',
      title: 'Publish This Content',
    },
    {
      value: 'hide',
      title: 'Hide This Content',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
  trackByIndex(index: number): number {
    return index;
  }
}
