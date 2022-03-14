import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'reactor-room-total-unpaid',
  templateUrl: './total-unpaid.component.html',
  styleUrls: ['./total-unpaid.component.scss'],
})
export class TotalUnpaidComponent implements OnInit {
  constructor() {}
  @Input() total;

  ngOnInit(): void {}
}
