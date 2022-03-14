import { Injectable, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LeadsService } from '@reactor-room/plusmar-front-end-share/services/leads/leads.service';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { getLeadInfoFormValidators } from '@reactor-room/plusmar-front-end-helpers';
import {
  AudienceLeadContext,
  AudienceUpdateOperation,
  IAudienceWithCustomer,
  ILeadsFormComponent,
  ILeadsFormComponentSubmissionOptions,
  ILeadsFormSubmission,
  ILeadsFormWithComponents,
  IManualRefFormInput,
  LeadViewMode,
} from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AudienceContactService } from '@reactor-room/plusmar-front-end-share/services/audience-contact/audience-contact.service';

@Injectable()
export class LeadsFormService {
  leadForm: FormGroup;
  hasSavedForm = false;
  isManualInput: boolean;
  formFields: ILeadsFormComponent[];
  selectedForm: ILeadsFormWithComponents;
  refID: string | null;
  audienceID: number;
  audience$: IAudienceWithCustomer;
  disableSaving = false;
  leadViewMode: LeadViewMode;
  formSubmission$: ILeadsFormSubmission;
  isCustomerFilled = false;
  failedToLoadLead = false;

  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    public translate: TranslateService,
    private leadService: LeadsService,
    private audienceContactService: AudienceContactService,
  ) {}

  getLeadContext(): void {
    this.leadService
      .getAudienceLeadContext(this.audienceID)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (val: AudienceLeadContext) => {
          this.failedToLoadLead = false;
          this.refID = val.refID;
          if (val.submissionID !== null) {
            this.getFormSubmission(val.submissionID);
            this.disableSaving = true;
          } else if (val.formID !== null) {
            this.leadViewMode = LeadViewMode.FILL_FORM;
            this.getForm(val.formID);
          } else {
            this.leadViewMode = LeadViewMode.EDIT;
          }
        },
        () => {
          this.failedToLoadLead = true;
        },
      );
  }

  getFormSubmission(formSubmissionID: number): void {
    this.leadService.getFormSubmissionByID(formSubmissionID).subscribe((val) => {
      this.isCustomerFilled = true;
      this.formSubmission$ = val;
      this.getForm(this.formSubmission$.form_id);
    });
  }

  getForm(ID: number): void {
    this.leadService.getFormByID(ID).subscribe(
      (formData: ILeadsFormWithComponents) => {
        this.selectedForm = formData;
        this.setForm(formData);
      },
      (err) => this.handleErrors(err),
    );
  }

  setForm(formData: ILeadsFormWithComponents): void {
    let formFieldsData = formData.components;
    let completeInputs = null;

    if (this.formSubmission$) {
      completeInputs = JSON.parse(this.formSubmission$.options);

      formFieldsData = formFieldsData.map((field) => {
        let match = completeInputs.find((input) => field.options.controlName === input.name);

        if (!match) {
          match = completeInputs.find((input) => field.index === input.index);
        }

        return { ...field, value: match?.value };
      });
    }

    const form = new Object();
    this.formFields = formFieldsData.map((field: ILeadsFormComponent) => {
      form[field.options.controlName] = [field?.['value'] ?? '', getLeadInfoFormValidators(field?.options.validation)];
      return field;
    });

    this.leadForm = this.formBuilder.group(form);

    this.toggleInputs();
  }

  onClickManual(checked: boolean): void {
    this.isManualInput = checked;
    this.toggleInputs();
  }

  toggleInputs(): void {
    if (this.leadForm) {
      Object.keys(this.leadForm.controls).map((key) => {
        !this.isManualInput || !this.audience$ ? this.leadForm.get(key).disable() : this.leadForm.get(key).enable();
      });
    }
  }

  saveForm(): void {
    if (this.leadForm.valid) {
      if (this.isManualInput) {
        this.saveFormSubmission(this.selectedForm.id);
      } else {
        this.openSuccessDialog();
      }
    } else {
      this.openErrorDialog('Please input form information');
    }
  }

  saveFormSubmission(formID: number): void {
    const options: ILeadsFormComponentSubmissionOptions[] = this.getFormSubmissionOptions();

    const formInput: IManualRefFormInput = {
      name: this.selectedForm.name,
      customerId: this.audience$.customer_id,
      audienceId: this.audience$.id,
      formId: formID,
      formJson: JSON.stringify(options),
      ref: this.refID,
    };

    this.leadService.manualInputAutomateForm(formInput).subscribe(() => {
      this.getLeadContext();
      this.audienceContactService.updateSingleAudience.next({ audienceID: this.audience$.id, operation: AudienceUpdateOperation.UPDATE });
      // void this.router.navigate([`/leads/closelead/${this.audience$.id}`]);
    });
  }

  getFormSubmissionOptions(): ILeadsFormComponentSubmissionOptions[] {
    const options: ILeadsFormComponentSubmissionOptions[] = [...this.formFields].map((field: ILeadsFormComponent) => {
      const { value } = this.leadForm.get(field?.options?.controlName);
      const option: any = { ...field, value: value };
      return option;
    });

    return options;
  }

  handleErrors(error: any): void {
    this.openErrorDialog(error);
  }
  openCopyDialog(link: string): void {
    this.openDialog(
      {
        title: 'Copied Successfully',
        text: link,
      },
      false,
    );
  }

  openSuccessDialog(): void {
    this.openDialog(
      {
        title: 'Saved Successfully',
        text: 'Data has been saved successfully...',
      },
      false,
    );
  }

  openDialog(data, isErr: boolean): void {
    const dialog = this.matDialog.open(SuccessDialogComponent, { width: '422px' });
    dialog.componentInstance['data'] = data;
    dialog.componentInstance.isError = isErr;
  }

  openErrorDialog(error: any): void {
    this.openDialog(
      {
        title: this.translate.instant('Something went wrong'),
        text: this.translate.instant(error),
      },
      true,
    );
  }
}
