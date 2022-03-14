import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'cms-next-content-draft-edit',
  templateUrl: './content-draft-edit.component.html',
  styleUrls: ['./content-draft-edit.component.scss'],
})
export class ContentDraftEditComponent implements OnInit {
  draftContentForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.draftContentForm = this.fb.group({});
  }
}
