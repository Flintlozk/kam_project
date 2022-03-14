import { Component, OnInit, ChangeDetectorRef, AfterContentChecked, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LeadsCreateFormService } from '../../../../services/leads-create-form.service';

@Component({
  selector: 'reactor-room-leads-create-form-view',
  templateUrl: './leads-create-form-view.component.html',
  styleUrls: ['./leads-create-form-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LeadsCreateFormViewComponent implements OnInit, AfterContentChecked {
  leadCreateFormView: FormGroup;
  imageBanner: any = null;
  fileData: File = null;

  styleVisibility: string;
  styleFont: string;
  styleColor: string;
  styleBackground: string;
  styleBorderColor: string;

  constructor(private leadsCreateFormService: LeadsCreateFormService) {}

  ngOnInit(): void {
    this.leadsCreateFormService.sharedLeadCreateForm.subscribe((form) => (this.leadCreateFormView = form));
  }
  ngAfterContentChecked() {
    this.leadCreateFormView.addControl('formName', new FormControl('', Validators.required));
    this.leadCreateFormView.addControl('bannerImg', new FormControl(null, Validators.required));

    this.setStylus();
  }

  setStylus() {
    this.styleVisibility = this.leadCreateFormView.value.designSections.visibility;
    this.styleFont = this.leadCreateFormView.value.designSections.fontFamily;
    this.styleColor = this.leadCreateFormView.value.designSections.color;
    this.styleBackground = this.leadCreateFormView.value.designSections.fillColor;
    this.styleBorderColor = this.leadCreateFormView.value.designSections.borderColor;
  }

  uploadImage(event: any) {
    this.fileData = <File>event.target.files[0];
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.imageBanner = reader.result;
    };
  }
  dismissImageBanner() {
    this.imageBanner = null;
  }
}
