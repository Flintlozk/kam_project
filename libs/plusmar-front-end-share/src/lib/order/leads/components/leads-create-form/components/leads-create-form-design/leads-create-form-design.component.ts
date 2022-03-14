import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { LeadsCreateFormService } from '../../../../services/leads-create-form.service';

@Component({
  selector: 'reactor-room-leads-create-form-design',
  templateUrl: './leads-create-form-design.component.html',
  styleUrls: ['./leads-create-form-design.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LeadsCreateFormDesignComponent implements OnInit {
  leadDesignForm: FormGroup;
  fieldFormArray: FormArray;
  calendarFormGroup: FormGroup;
  checkboxFormGroup: FormGroup;
  checkboxFormArray: FormArray;
  radioFormGroup: FormGroup;
  radioFormArray: FormArray;
  dropdownFormGroup: FormGroup;
  dropdownFormArray: FormArray;
  titleFormGroup: FormGroup;
  paragraphFormGroup: FormGroup;

  template = [
    { formType: 'textbox', fieldTitle: 'Textbox', fieldImgUrl: 'assets/img/leads/textbox.png', info: false },
    { formType: 'textarea', fieldTitle: 'Text area', fieldImgUrl: 'assets/img/leads/textarea.png', info: false },
    { formType: 'checkbox', fieldTitle: 'Check box', fieldImgUrl: 'assets/img/leads/checkbox.png', info: false },
    { formType: 'radio', fieldTitle: 'Radio', fieldImgUrl: 'assets/img/leads/radio.png', info: false },
    { formType: 'dropdown', fieldTitle: 'Dropdown', fieldImgUrl: 'assets/img/leads/dropdown.png', info: false },
    { formType: 'calendar', fieldTitle: 'Calendar', fieldImgUrl: 'assets/img/leads/calendar.png', info: false },
    { formType: 'number', fieldTitle: 'Number', fieldImgUrl: 'assets/img/leads/number.png', info: false },
    { formType: 'phone', fieldTitle: 'Phone', fieldImgUrl: 'assets/img/leads/phone.png', info: false },
    { formType: 'telephone', fieldTitle: 'Telephone', fieldImgUrl: 'assets/img/leads/telephone.png', info: false },
    { formType: 'title', fieldTitle: 'Title', fieldImgUrl: 'assets/img/leads/title.png', info: true },
    { formType: 'paragraph', fieldTitle: 'Paragraph', fieldImgUrl: 'assets/img/leads/paragraph.png', info: true },
  ];

  selectedTemplate = [
    { formType: 'textbox', formLabel: 'Name', required: true, default: true, formValue: null, info: false },
    { formType: 'phone', formLabel: 'Phone no.', required: true, default: true, formValue: null, info: false },
    { formType: 'textbox', formLabel: '', required: false, default: false, formValue: null, info: false },
  ];

  settingToggleMenu = [
    { title: 'Design Sections', status: false },
    { title: 'Greeting & Thank you message', status: false },
    { title: 'Terms and condition', status: false },
  ];

  fontFamilyData = [
    { value: "'Prompt-Light', 'Prompt Light', 'Prompt', sans-serif", viewValue: 'Prompt' },
    { value: "'Arial, sans-serif'", viewValue: 'Arial' },
    { value: "'Helvetica Neue', Helvetica, sans-serif", viewValue: 'Helvetica' },
  ];

  visibilityData = [
    {
      status: true,
      formControl: 'border',
      title: 'Border',
      imgUrl: 'assets/img/leads/icon_border_inactive.png',
      imgActiveUrl: 'assets/img/leads/icon_border_active.png',
    },
    {
      status: false,
      formControl: 'underline',
      title: 'Underline',
      imgUrl: 'assets/img/leads/icon_underline_inactive.png',
      imgActiveUrl: 'assets/img/leads/icon_underline_active.png',
    },
  ];

  constructor(private leadFormBuilder: FormBuilder, private leadsCreateFormService: LeadsCreateFormService) {}

  ngOnInit(): void {
    this.leadDesignForm = this.getLeadDesignFormGroup();
    this.fieldFormArray = this.getfieldFormArray();
    this.leadsCreateFormService.updateLeadCreateForm(this.leadDesignForm);
  }

  resetDesignSectionStyle() {
    for (let i = 0; i < this.visibilityData.length; i++) {
      this.visibilityData[i].status = false;
    }
    this.visibilityData[0].status = true;
    this.leadDesignForm.get('designSections').get('visibility').patchValue(this.visibilityData[0].formControl);
    this.leadDesignForm.get('designSections').setValue(this.getDesignSectionsFormGroup().value);
  }

  toggleSettingMenu(index: number) {
    this.settingToggleMenu[index].status = !this.settingToggleMenu[index].status;
  }

  setVisibilityStatus(index: number) {
    for (let i = 0; i < this.visibilityData.length; i++) {
      this.visibilityData[i].status = false;
    }
    this.visibilityData[index].status = true;
    this.leadDesignForm.get('designSections').get('visibility').patchValue(this.visibilityData[index].formControl);
  }

  setSelectTemplateItemToForm(formArrayIndex: number, templateIndex: number) {
    const formTypeFormControl = this.getfieldFormArray().controls[formArrayIndex].get('formType');
    formTypeFormControl.setValue(this.template[templateIndex].formType);

    const infoFormControl = this.getfieldFormArray().controls[formArrayIndex].get('info');
    infoFormControl.setValue(this.template[templateIndex].info);

    const formLabelFormControl = this.getfieldFormArray().controls[formArrayIndex].get('formLabel');

    const formValueFormControl = this.getfieldFormArray().controls[formArrayIndex].get('formValue') as FormGroup;
    if (formTypeFormControl.value === 'calendar') {
      this.calendarFormGroup = this.getCalendarFormGroup();
      formValueFormControl.patchValue(this.calendarFormGroup.value);
    } else if (formTypeFormControl.value === 'checkbox') {
      this.checkboxFormGroup = this.getCheckBoxFormGroup();
      this.checkboxFormArray = this.getCheckboxFormArray();
      formValueFormControl.patchValue(this.checkboxFormGroup.value);
    } else if (formTypeFormControl.value === 'radio') {
      this.radioFormGroup = this.getRadioFormGroup();
      this.radioFormArray = this.getRadioFormArray();
      formValueFormControl.patchValue(this.radioFormGroup.value);
    } else if (formTypeFormControl.value === 'dropdown') {
      this.dropdownFormGroup = this.getDropDownFormGroup();
      this.dropdownFormArray = this.getDropDownFormArray();
      formValueFormControl.patchValue(this.dropdownFormGroup.value);
    } else if (formTypeFormControl.value === 'title') {
      this.titleFormGroup = this.getTitleFormGroup();
      formValueFormControl.patchValue(this.titleFormGroup.value);
    } else if (formTypeFormControl.value === 'paragraph') {
      this.paragraphFormGroup = this.getParagraphFormGroup();
      formLabelFormControl.setValue('Paragraph');
      formValueFormControl.patchValue(this.paragraphFormGroup.value);
    } else {
      formValueFormControl.patchValue(null);
    }
  }

  setDateRangeStatusToForm(formArrayIndex: number) {
    const formValueFormControl = this.getfieldFormArray().controls[formArrayIndex].get('formValue');
    formValueFormControl.setValue(this.calendarFormGroup.value);
  }

  setCheckboxFromToForm(formArrayIndex: number) {
    const checkBoxItemFormArray = this.checkboxFormGroup.get('checkBoxItem') as FormArray;
    checkBoxItemFormArray.patchValue(this.checkboxFormArray.value);
    const formValueFormControl = this.getfieldFormArray().controls[formArrayIndex].get('formValue');
    formValueFormControl.setValue(this.checkboxFormGroup.value);
  }

  addcheckboxFormArray(formArrayIndex: number) {
    this.checkboxFormArray.push(new FormControl());
    const checkBoxItemFormArray = this.checkboxFormGroup.get('checkBoxItem') as FormArray;
    checkBoxItemFormArray.push(new FormControl());
    this.setCheckboxFromToForm(formArrayIndex);
  }

  removecheckboxFormArray(formArrayIndex: number, checkboxItemIndex: number) {
    this.checkboxFormArray.removeAt(checkboxItemIndex);
    const checkBoxItemFormArray = this.checkboxFormGroup.get('checkBoxItem') as FormArray;
    checkBoxItemFormArray.removeAt(checkboxItemIndex);
    this.setCheckboxFromToForm(formArrayIndex);
  }

  setRadioFromToForm(formArrayIndex: number) {
    const radioItemFormArray = this.radioFormGroup.get('radioItem') as FormArray;
    radioItemFormArray.patchValue(this.radioFormArray.value);
    const formValueFormControl = this.getfieldFormArray().controls[formArrayIndex].get('formValue');
    formValueFormControl.setValue(this.radioFormGroup.value);
  }

  addRadioFormArray(formArrayIndex: number) {
    this.radioFormArray.push(new FormControl());
    const radioItemFormArray = this.radioFormGroup.get('radioItem') as FormArray;
    radioItemFormArray.push(new FormControl());
    this.setRadioFromToForm(formArrayIndex);
  }

  removeRadioFormArray(formArrayIndex: number, radioItemIndex: number) {
    this.radioFormArray.removeAt(radioItemIndex);
    const radioItemFormArray = this.radioFormGroup.get('radioItem') as FormArray;
    radioItemFormArray.removeAt(radioItemIndex);
    this.setRadioFromToForm(formArrayIndex);
  }

  setDropdownFromToForm(formArrayIndex: number) {
    const dropdownItemFormArray = this.dropdownFormGroup.get('dropdownItem') as FormArray;
    dropdownItemFormArray.patchValue(this.dropdownFormArray.value);
    const formValueFormControl = this.getfieldFormArray().controls[formArrayIndex].get('formValue');
    formValueFormControl.setValue(this.dropdownFormGroup.value);
  }

  addDropdownFormArray(formArrayIndex: number) {
    this.dropdownFormArray.push(new FormControl());
    const dropdownItemFormArray = this.dropdownFormGroup.get('dropdownItem') as FormArray;
    dropdownItemFormArray.push(new FormControl());
    this.setDropdownFromToForm(formArrayIndex);
  }

  removeDropdownFormArray(formArrayIndex: number, dropdownItemIndex: number) {
    this.dropdownFormArray.removeAt(dropdownItemIndex);
    const dropdownItemFormArray = this.dropdownFormGroup.get('dropdownItem') as FormArray;
    dropdownItemFormArray.removeAt(dropdownItemIndex);
    this.setDropdownFromToForm(formArrayIndex);
  }

  setTitleFormToForm(formArrayIndex: number) {
    const formValueFormControl = this.getfieldFormArray().controls[formArrayIndex].get('formValue');
    formValueFormControl.setValue(this.titleFormGroup.value);
  }

  setParagraphFormToForm(formArrayIndex: number) {
    const formValueFormControl = this.getfieldFormArray().controls[formArrayIndex].get('formValue');
    formValueFormControl.setValue(this.paragraphFormGroup.value);
  }

  getfieldFormArray(): FormArray {
    return this.leadDesignForm.get('fieldArray') as FormArray;
  }

  addLeadDesignFieldFormArray() {
    this.fieldFormArray.push(this.getLeadDesignFieldFormGroup());
  }

  removeLeadDesignFieldFormArray(index: number) {
    this.fieldFormArray.removeAt(index);
  }

  setRequiredFromFieldStatus(index: number) {
    const requiredFormControl = this.getfieldFormArray().controls[index].get('required');
    requiredFormControl.setValue(!requiredFormControl.value);
  }

  getTemplateImage(name: string) {
    const imgUrl = this.template.find(({ formType }) => formType === name);
    return imgUrl.fieldImgUrl;
  }

  dragDropEvent(event: CdkDragDrop<FormArray[]>) {
    moveItemInArray(this.fieldFormArray.controls, event.previousIndex, event.currentIndex);
    this.leadDesignForm.get('fieldArray').patchValue(this.fieldFormArray.controls);
  }

  dragDropCheckBoxEvent(event: CdkDragDrop<FormArray[]>, formArrayIndex: number) {
    moveItemInArray(this.checkboxFormArray.value, event.previousIndex, event.currentIndex);
    moveItemInArray(this.checkboxFormArray.controls, event.previousIndex, event.currentIndex);
    this.setCheckboxFromToForm(formArrayIndex);
  }

  dragDropRadioEvent(event: CdkDragDrop<string[]>, formArrayIndex: number) {
    moveItemInArray(this.radioFormArray.value, event.previousIndex, event.currentIndex);
    moveItemInArray(this.radioFormArray.controls, event.previousIndex, event.currentIndex);
    this.setRadioFromToForm(formArrayIndex);
  }

  dragDropDropdownEvent(event: CdkDragDrop<string[]>, formArrayIndex: number) {
    moveItemInArray(this.dropdownFormArray.value, event.previousIndex, event.currentIndex);
    moveItemInArray(this.dropdownFormArray.controls, event.previousIndex, event.currentIndex);
    this.setDropdownFromToForm(formArrayIndex);
  }

  getLeadDesignFormGroup(): FormGroup {
    const leadDesignFormGroup = this.leadFormBuilder.group({
      fieldArray: this.getLeadDesignFieldFormArray(),
      endingMessage: [''],
      termConditionStatus: [false],
      messageBox: this.leadFormBuilder.group({
        greetingMessage: [''],
        thankMessage: [''],
      }),
      designSections: this.getDesignSectionsFormGroup(),
    });
    return leadDesignFormGroup;
  }

  getDesignSectionsFormGroup(): FormGroup {
    const designSectionsFormGroup = this.leadFormBuilder.group({
      fontFamily: ["'Prompt-Light', 'Prompt Light', 'Prompt', sans-serif"],
      color: ['#576F83'],
      visibility: ['border'],
      borderColor: ['#dddfe'],
      fillColor: ['#FFFFFF'],
    });
    return designSectionsFormGroup;
  }

  getLeadDesignFieldFormArray(): FormArray {
    const leadDesignFieldFormGroup = this.leadFormBuilder.array([this.getLeadDesignNameFormGroup(), this.getLeadDesignPhoneNoFormGroup(), this.getLeadDesignFieldFormGroup()]);
    return leadDesignFieldFormGroup;
  }

  getLeadDesignNameFormGroup(): FormGroup {
    const leadDesignNameFormGroup = this.leadFormBuilder.group({
      formType: ['textbox'],
      formLabel: ['Name'],
      required: [true],
      default: [true],
      info: [false],
      formValue: [null],
      designSectionsStatus: [false],
    });
    return leadDesignNameFormGroup;
  }

  getLeadDesignPhoneNoFormGroup(): FormGroup {
    const leadDesignPhoneNoFormGroup = this.leadFormBuilder.group({
      formType: ['phone'],
      formLabel: ['Phone no.'],
      required: [true],
      default: [true],
      info: [false],
      formValue: [null],
      designSectionsStatus: [false],
    });
    return leadDesignPhoneNoFormGroup;
  }

  getLeadDesignFieldFormGroup(): FormGroup {
    const leadDesignFieldFormGroup = this.leadFormBuilder.group({
      formType: ['textbox'],
      formLabel: [''],
      required: [false],
      default: [false],
      info: [false],
      formValue: [null],
      designSectionsStatus: [false],
    });
    return leadDesignFieldFormGroup;
  }

  getCalendarFormGroup(): FormGroup {
    const calendarFormGroup = this.leadFormBuilder.group({
      dateRangeStatus: [false],
    });
    return calendarFormGroup;
  }

  getCheckBoxFormGroup(): FormGroup {
    const checkboxFormGroup = this.leadFormBuilder.group({
      checkBoxItem: this.getCheckboxFormArray(),
      otherCheckbox: [false],
    });
    return checkboxFormGroup;
  }

  getCheckboxFormArray(): FormArray {
    const checkboxFormArray = this.leadFormBuilder.array([new FormControl(), new FormControl(), new FormControl()]);
    return checkboxFormArray;
  }

  getRadioFormGroup(): FormGroup {
    const radioFormGroup = this.leadFormBuilder.group({
      radioItem: this.getRadioFormArray(),
      otherRadio: [false],
    });
    return radioFormGroup;
  }

  getRadioFormArray(): FormArray {
    const radioFormArray = this.leadFormBuilder.array([new FormControl(), new FormControl(), new FormControl()]);
    return radioFormArray;
  }

  getDropDownFormGroup(): FormGroup {
    const dropdownFormGroup = this.leadFormBuilder.group({
      dropdownItem: this.getDropDownFormArray(),
    });
    return dropdownFormGroup;
  }

  getDropDownFormArray(): FormArray {
    const dropdownFormArray = this.leadFormBuilder.array([new FormControl(), new FormControl(), new FormControl()]);
    return dropdownFormArray;
  }

  getTitleFormGroup(): FormGroup {
    const titleFormGroup = this.leadFormBuilder.group({
      title: [''],
    });
    return titleFormGroup;
  }

  getParagraphFormGroup(): FormGroup {
    const paragraphFormGroup = this.leadFormBuilder.group({
      paragraph: [''],
    });
    return paragraphFormGroup;
  }
}
