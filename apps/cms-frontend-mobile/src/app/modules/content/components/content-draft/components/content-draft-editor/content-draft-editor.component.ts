import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { FadeAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-content-draft-editor',
  templateUrl: './content-draft-editor.component.html',
  styleUrls: ['./content-draft-editor.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class ContentDraftEditorComponent implements OnInit {
  doneButtonStatus = false;

  parentForm: FormGroup;

  contentFormGroup = new FormGroup({
    contentData: new FormControl('', Validators.required),
  });

  constructor(private parentFormDirective: FormGroupDirective) {}

  ngOnInit(): void {
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('content', this.contentFormGroup);
  }

  onOutsideQuillEditor(event: boolean): void {
    if (event) this.doneButtonStatus = false;
    else this.doneButtonStatus = true;
  }

  onSaveDraftContent(): void {}
}
