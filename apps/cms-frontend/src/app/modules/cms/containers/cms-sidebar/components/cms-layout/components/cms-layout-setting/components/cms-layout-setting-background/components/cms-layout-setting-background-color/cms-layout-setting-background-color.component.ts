import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'cms-next-cms-layout-setting-background-color',
  templateUrl: './cms-layout-setting-background-color.component.html',
  styleUrls: ['./cms-layout-setting-background-color.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutSettingBackgroundColorComponent implements OnInit {
  layoutSettingBackgroundColorForm: FormGroup;
  parentForm: FormGroup;
  constructor(private fb: FormBuilder, private parentFormDirective: FormGroupDirective) {}

  ngOnInit(): void {
    this.layoutSettingBackgroundColorForm = this.getLayoutSettingBackgroundColorFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('layoutSettingBackgroundColorForm', this.layoutSettingBackgroundColorForm);
  }
  getLayoutSettingBackgroundColorFormGroup(): FormGroup {
    const layoutSettingBackgroundColorFormGroup = this.fb.group({
      color: [''],
      opacity: [100],
    });
    return layoutSettingBackgroundColorFormGroup;
  }

  onRemoveColorProperty(): void {
    this.layoutSettingBackgroundColorForm.get('color').patchValue('');
  }
}
