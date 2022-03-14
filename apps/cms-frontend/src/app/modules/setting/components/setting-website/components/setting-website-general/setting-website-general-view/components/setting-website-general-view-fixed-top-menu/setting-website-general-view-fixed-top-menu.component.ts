import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EnumConfigLinkTypes, EnumConfigTargetHref } from '@reactor-room/cms-models-lib';
import { ScaleAnimate } from '@reactor-room/animation';
@Component({
  selector: 'cms-next-setting-website-general-view-fixed-top-menu',
  templateUrl: './setting-website-general-view-fixed-top-menu.component.html',
  styleUrls: ['./setting-website-general-view-fixed-top-menu.component.scss'],
  animations: [ScaleAnimate.translateYAnimation],
})
export class SettingWebsiteGeneralViewFixedTopMenuComponent implements OnInit {
  @Input() dialogForm: FormGroup;
  toggleStatus = false;
  constructor() {}
  get getFileUpload(): FormControl {
    return this.dialogForm.get('image_url') as FormControl;
  }
  get getLinktypes(): EnumConfigLinkTypes[] {
    return this.dialogForm.get('link_type.link_types').value;
  }
  get getTargetHref(): EnumConfigTargetHref[] {
    return this.dialogForm.get('link_type.target_href.target_href').value;
  }
  get getSelectedTargetHref(): EnumConfigTargetHref {
    return this.dialogForm.get('link_type.target_href.selected_target_href').value;
  }

  get getSelectedLinkType(): EnumConfigLinkTypes {
    return this.dialogForm.get('link_type.selected_link_type').value;
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
