import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cms-next-cms-popover-layout',
  templateUrl: './cms-popover-layout.component.html',
  styleUrls: ['./cms-popover-layout.component.scss'],
})
export class CmsPopoverLayoutComponent implements OnInit {
  closeBtn = false;
  saveBtn = true;

  @Output() popOverBtn = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}

  popOverBtnEvent(btnStatus: boolean): void {
    this.popOverBtn.emit(btnStatus);
  }
}
