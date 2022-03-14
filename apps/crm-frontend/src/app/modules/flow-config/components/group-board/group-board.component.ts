import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'reactor-room-group-board',
  templateUrl: './group-board.component.html',
  styleUrls: ['./group-board.component.scss'],
})
export class GroupBoardComponent {
  @Input() groupBoardList;
}
