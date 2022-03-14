import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplatesService } from './templates.service';

export enum Type {
  CHAT = 'CHAT',
  COMMENT = 'COMMENT',
}
export interface Data {
  feature: Feature;
  type: Type;
}
export interface Feature {
  message: boolean;
  form: boolean;
  social: boolean;
  product: boolean;
  images: boolean;
  catalog: boolean;
}
@Component({
  selector: 'reactor-room-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
})
export class TemplatesComponent implements OnInit {
  type: Type = Type.CHAT;
  feature: Feature = {
    message: true,
    form: true,
    social: true,
    product: true,
    images: true,
    catalog: true,
  };

  constructor(private dialogRef: MatDialogRef<TemplatesComponent>, public templateService: TemplatesService, @Inject(MAT_DIALOG_DATA) public data: Data) {}

  ngOnInit(): void {
    if (this.data) {
      this.feature = this.data.feature;
      this.type = this.data.type;
    }
  }

  closeModal(): void {
    this.dialogRef.close(false);
  }
}
