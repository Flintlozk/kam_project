import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'cms-next-content-draft-new',
  templateUrl: './content-draft-new.component.html',
  styleUrls: ['./content-draft-new.component.scss'],
})
export class ContentDraftNewComponent implements OnInit {
  draftContentForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.draftContentForm = this.fb.group({});
  }
}
