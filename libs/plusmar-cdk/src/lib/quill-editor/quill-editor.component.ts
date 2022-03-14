import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductCommonService } from '../services/product-common.service';

@Component({
  selector: 'reactor-room-quill-editor',
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.less'],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class QuillEditorComponent implements OnInit, OnDestroy {
  @Input() placeholder;
  styleToolbarStatus = false;
  quillDescriptionFormControl: FormControl;
  parentForm: FormGroup;
  isSaveClickSubscription: Subscription;
  quillForm = new FormGroup({
    description: new FormControl('', [Validators.required]),
  });

  constructor(private parentFormDirective: FormGroupDirective, private productCommonService: ProductCommonService) {}

  ngOnInit(): void {
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('quill', this.quillForm);
    const quillFormGroup = this.parentForm.controls.quill as FormGroup;
    this.quillDescriptionFormControl = quillFormGroup.controls.description as FormControl;
    this.isSaveClickSubscription = this.productCommonService.getIsProductSaveClicked.subscribe((value) => {
      if (value) {
        this.showQuillError();
      }
    });
  }

  showQuillError(): void {
    const quillControl = this.parentForm.get('quill.description');
    const isRequired = quillControl.errors?.required;
    if (isRequired) {
      quillControl.markAsTouched();
      quillControl.markAsDirty();
    }
  }

  styleToolbarToogle(): void {
    this.styleToolbarStatus = !this.styleToolbarStatus;
  }

  ngOnDestroy(): void {
    if (this.isSaveClickSubscription) this.isSaveClickSubscription.unsubscribe();
  }
}
