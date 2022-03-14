import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'reactor-room-setting-facebook-comment',
  templateUrl: './setting-facebook-comment.component.html',
  styleUrls: ['./setting-facebook-comment.component.scss'],
})
export class SettingFacebookCommentComponent implements OnInit {
  @Input() isAllowed = false;
  @Input() isEnabled = false;
  constructor() {}

  ngOnInit(): void {}

  toggleFeature(): void {}
}
