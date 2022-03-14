import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ScaleAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-setting-website-general-view-facebook-comment',
  templateUrl: './setting-website-general-view-facebook-comment.component.html',
  styleUrls: ['./setting-website-general-view-facebook-comment.component.scss'],
  animations: [ScaleAnimate.translateYAnimation],
})
export class SettingWebsiteGeneralViewFacebookCommentComponent implements OnInit {
  @Input() dialogForm: FormGroup;
  toggleStatus = false;
  constructor() {}

  ngOnInit(): void {}
  toggle(): void {
    this.toggleStatus = !this.toggleStatus;
  }
  onClickOutside(event: boolean): void {
    if (event) this.toggleStatus = false;
  }
}
