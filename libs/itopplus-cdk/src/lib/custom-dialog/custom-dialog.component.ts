import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'reactor-room-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.less'],
})
export class CustomDialogComponent implements OnInit {
  @Input() head = true;
  @Input() isFull;

  constructor() {}

  ngOnInit(): void {}
}
