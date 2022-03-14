import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { IMemberFlow, ViewTaskEnum } from '../../modules/task/task.model';
@Component({
  selector: 'reactor-room-top-tool-bar-component',
  templateUrl: './top-tool-bar-component.component.html',
  styleUrls: ['./top-tool-bar-component.component.scss'],
})
export class TopToolBarComponentComponent implements OnInit {
  viewTask = ViewTaskEnum.CARD_VIEW;
  @Input() viewType: string[];
  @Input() memberFlow: IMemberFlow[];
  @Input() headerName: string;
  @Output() viewTaskEvent = new EventEmitter<string>();
  profilePicUrl: string;
  constructor() {}

  ngOnInit(): void {
    this.profilePicUrl = getCookie('profile_pic_url');
  }
  onChangeView(viewType): void {
    this.viewTaskEvent.emit(viewType);
  }
}
