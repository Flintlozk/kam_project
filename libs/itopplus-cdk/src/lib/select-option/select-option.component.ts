import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

interface SelectData {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'reactor-room-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectOptionComponent implements OnInit {
  @Input() selectData: SelectData[];

  constructor() {}

  ngOnInit(): void {}
}
