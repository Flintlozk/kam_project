import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EnumConfigLinkTypes, EnumConfigTargetHref } from '@reactor-room/cms-models-lib';
import { SettingGeneralService } from 'apps/cms-frontend/src/app/modules/setting/services/setting-general/setting-general-service';
import { FadeAnimate, ScaleAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-setting-website-general-view-advert-display',
  templateUrl: './setting-website-general-view-advert-display.component.html',
  styleUrls: ['./setting-website-general-view-advert-display.component.scss'],
  animations: [FadeAnimate.fadeInAnimation, ScaleAnimate.translateYAnimation],
})
export class SettingWebsiteGeneralViewAdvertDisplayComponent implements OnInit {
  selectedIndex = 0;
  animateIndex = 0;
  toggleStatus = false;
  @Input() dialogForm: FormGroup;
  constructor(private settingService: SettingGeneralService) {}
  get getFileUpload(): FormControl {
    return this.dialogForm.get('upload.image_url') as FormControl;
  }
  get getLinktypes(): EnumConfigLinkTypes[] {
    return this.dialogForm.get('upload.link_type.link_types').value;
  }
  get getTargetHref(): EnumConfigTargetHref[] {
    return this.dialogForm.get('upload.link_type.target_href.target_href').value;
  }
  get getSelectedTargetHref(): EnumConfigTargetHref {
    return this.dialogForm.get('upload.link_type.target_href.selected_target_href').value;
  }

  get getSelectedLinkType(): EnumConfigLinkTypes {
    return this.dialogForm.get('upload.link_type.selected_link_type').value;
  }
  ngOnInit(): void {}

  changeIndex(index: number): void {
    this.selectedIndex = index;
  }
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
