import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'reactor-room-plus-icon',
  templateUrl: './plus.component.html',
  styleUrls: ['./plus.component.scss'],
})
export class PlusComponent implements OnInit {
  constructor() {}
  @Input() color = '#F1F2F6';
  ngOnInit(): void {}
}
