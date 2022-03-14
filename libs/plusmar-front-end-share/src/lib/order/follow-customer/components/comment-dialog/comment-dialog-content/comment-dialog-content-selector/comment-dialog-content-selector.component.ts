import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'reactor-room-comment-dialog-content-selector',
  templateUrl: './comment-dialog-content-selector.component.html',
  styleUrls: ['./comment-dialog-content-selector.component.scss'],
})
export class CommentDialogContentSelectorComponent implements OnInit {
  @Input() Selector: string;
  @Input() Date: string;

  constructor() {}

  ngOnInit(): void {}
}
