import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'reactor-room-products-tags-dialog',
  templateUrl: './products-tags-dialog.component.html',
  styleUrls: ['./products-tags-dialog.component.scss'],
})
export class ProductsTagsDialogComponent implements OnInit {
  tagForm: FormGroup;
  tags: any[] = [];
  tagDisplayFlag = [true];
  get tagArray(): FormArray {
    return <FormArray>this.tagForm.get('tagName');
  }

  constructor(
    public dialogRef: MatDialogRef<ProductsTagsDialogComponent>,
    private tagFormBuilder: FormBuilder,

    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.tagForm = this.tagFormBuilder.group({
      tagName: new FormArray([new FormControl('', [Validators.required])]),
    });
  }

  addTag(i: number) {
    this.tagArray.push(new FormControl('', [Validators.required]));
    this.tagDisplayFlag.push(true);
    this.tagDisplayFlag[i] = false;
  }
  removeTag(i: number) {
    this.tagArray.removeAt(i);
    this.tagDisplayFlag.slice(i, 1);
    this.tagDisplayFlag[i - 1] = true;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  saveTag(): void {
    this.dialogRef.close(this.tagForm.value.tagName);
  }
}
