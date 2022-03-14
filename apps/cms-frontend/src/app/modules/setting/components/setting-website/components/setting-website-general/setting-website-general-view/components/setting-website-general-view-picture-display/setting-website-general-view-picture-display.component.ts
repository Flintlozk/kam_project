import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EnumConfigLinkTypes, EnumConfigTargetHref } from '@reactor-room/cms-models-lib';
import { FadeAnimate, ScaleAnimate } from '@reactor-room/animation';
@Component({
  selector: 'cms-next-setting-website-general-view-picture-display',
  templateUrl: './setting-website-general-view-picture-display.component.html',
  styleUrls: ['./setting-website-general-view-picture-display.component.scss'],
  animations: [FadeAnimate.fadeInAnimation, ScaleAnimate.translateYAnimation],
})
export class SettingWebsiteGeneralViewPictureDisplayComponent implements OnInit {
  @Input() dialogForm: FormGroup;
  toggleStatus = false;
  constructor() {}
  get getFileUpload(): FormControl {
    return this.dialogForm.get('image_url') as FormControl;
  }
  get getLinktypes(): EnumConfigLinkTypes[] {
    return this.dialogForm.get('image.link_type.link_types').value;
  }
  get getSelectedLinkType(): EnumConfigLinkTypes {
    return this.dialogForm.get('image.link_type.selected_link_type').value;
  }
  get getSelectedTargetHref(): EnumConfigTargetHref {
    return this.dialogForm.get('image.link_type.target_href.selected_target_href').value;
  }
  get getTargetHref(): EnumConfigTargetHref[] {
    return this.dialogForm.get('image.link_type.target_href.target_href').value;
  }

  get getEndTimeActive(): boolean {
    return this.dialogForm.get('end_time.is_active').value;
  }
  get getDisplayMobileActive(): boolean {
    return this.dialogForm.get('display_on_mobile.is_active').value;
  }
  ngOnInit(): void {}
  toggle(): void {
    this.toggleStatus = !this.toggleStatus;
  }
  onClickOutside(event: boolean): void {
    if (event) this.toggleStatus = false;
  }

  onFileSelected(event): void {
    const file = event.target.files;
    if (file.length > 0) {
      this.getFileUpload.setValue(file[0].name);
      this.getFileUpload.markAsDirty();
    }
  }
}
