import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EnumConfigGeneral } from '@reactor-room/cms-models-lib';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-next-setting-website-icon-upload',
  templateUrl: './setting-website-icon-upload.component.html',
  styleUrls: ['./setting-website-icon-upload.component.scss'],
})
export class SettingWebsiteIconUploadComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup;
  @Output() formGroupChange = new EventEmitter<any>();
  @Output() readyToPatch: EventEmitter<{ name: string }> = new EventEmitter<{ name: string }>();
  destroy$ = new Subject<void>();
  favicon: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formCheck();
  }
  formCheck(): void {
    const form = this.formGroup.get('favicon') as FormGroup;
    if (_.isEmpty(form)) {
      this.favicon = this.fb.group({
        image_url: [''],
      });
      this.formGroup.addControl('favicon', this.favicon);
    } else {
      this.favicon = form;
    }
    this.readyToPatch.emit({ name: EnumConfigGeneral.ICON_UPLOAD });
  }
  onFileSelected(event): void {
    const file = event.target.files;
    if (file.length > 0) {
      this.favicon.get('image_url').setValue(file[0].name);
      this.favicon.markAsDirty();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
