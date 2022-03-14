import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SettingGeneralService } from 'apps/cms-frontend/src/app/modules/setting/services/setting-general/setting-general-service';
import { ScaleAnimate } from '@reactor-room/animation';
@Component({
  selector: 'cms-next-setting-website-general-view-back-to-top',
  templateUrl: './setting-website-general-view-back-to-top.component.html',
  styleUrls: ['./setting-website-general-view-back-to-top.component.scss'],
  animations: [ScaleAnimate.translateYAnimation],
})
export class SettingWebsiteGeneralViewBackToTopComponent implements OnInit {
  @Input() dialogForm: FormGroup;
  toggleStatus = false;
  constructor(private settingService: SettingGeneralService) {}
  get getFileUpload(): FormControl {
    return this.dialogForm.get('image_url') as FormControl;
  }
  get getPosition(): FormControl {
    return this.dialogForm.get('position') as FormControl;
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
