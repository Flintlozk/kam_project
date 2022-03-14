import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'reactor-room-comment-dialog-content',
  templateUrl: './comment-dialog-content.component.html',
  styleUrls: ['./comment-dialog-content.component.scss'],
})
export class CommentDialogContentComponent implements OnInit {
  @Input() senderProfilePic: string;
  @Input() senderName: string;
  @Input() lastMessage: string;

  constructor() {}

  ngOnInit(): void {}
}
