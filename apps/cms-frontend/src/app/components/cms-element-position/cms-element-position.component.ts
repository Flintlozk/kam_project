import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { ETextAlignment } from '@reactor-room/cms-models-lib';
import { textAlignmentData } from '../../modules/cms/containers/cms-sidebar/components/cms-layout/cms-layout.list';
import { textDefault } from './../../../environments/environment';

@Component({
  selector: 'cms-next-cms-element-position',
  templateUrl: './cms-element-position.component.html',
  styleUrls: ['./cms-element-position.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsElementPositionComponent implements OnInit {
  @Input() positionLabel = 'Position';
  @Input() isRemoveJustify = false;

  textAlignmentData = textAlignmentData;
  ETextAlignment = ETextAlignment;
  parentForm: FormGroup;
  constructor(private parentFormDirective: FormGroupDirective) {}
  ngOnInit(): void {
    if (this.isRemoveJustify) {
      this.textAlignmentData = textAlignmentData.filter(({ value }) => value !== ETextAlignment.JUSTIFY);
    }
    this.setUpForm();
    this.setTextAlignmentData();
  }

  setUpForm() {
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('position', new FormControl(textDefault.defaultTextAlignment));
  }

  setTextAlignmentData(): void {
    this.textAlignmentData.forEach((align) => (align.selected = false));
    const textAlignment = this.parentForm.get('position').value;
    this.textAlignmentData.find((align) => align.value === textAlignment).selected = true;
  }

  onTextAlignment(index: number): void {
    this.textAlignmentData.forEach((align) => (align.selected = false));
    this.textAlignmentData[index].selected = true;
    const textAlignmentFormGroup = this.parentForm.get('position');
    textAlignmentFormGroup.patchValue(this.textAlignmentData[index].value);
  }
}
