import { animate, state, style, transition, trigger } from '@angular/animations';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PageMemberService } from '@reactor-room/plusmar-front-end-share/services/settings/page-member.service';
import {
  ChatboxView,
  IAudienceWithCustomer,
  ILeadsForm,
  ILeadsFormComponent,
  ILeadsFormSubmission,
  ILeadsFormWithComponents,
  IThread,
  LeadViewMode,
  MessageSentByEnum,
} from '@reactor-room/itopplus-model-lib';
import { Subscription } from 'rxjs';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { LeadsService } from '@reactor-room/plusmar-front-end-share/services/leads/leads.service';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';

@Component({
  selector: 'reactor-room-leads-form-editor',
  templateUrl: './leads-form-editor.component.html',
  styleUrls: ['./leads-form-editor.component.scss'],
  animations: [
    trigger('slideBox', [
      state(
        'active',
        style({
          bottom: '*',
        }),
      ),
      state(
        'inactive',
        style({
          bottom: '-100%',
        }),
      ),
      transition('inactive => active', [animate('0.3s')]),
      transition('active => inactive', [animate('0.1s')]),
    ]),
  ],
})
export class LeadsFormEditorComponent implements OnInit, OnDestroy {
  available = true;
  enumLeadViewMode = LeadViewMode;
  leadViewMode: LeadViewMode;
  chatViewMode: ChatboxView = ChatboxView.AUDIENCE;
  routeResolver$ = this.route.data;
  disableSaving = false;
  selectedForm: ILeadsFormWithComponents;
  audience$: IAudienceWithCustomer;
  sentBy = MessageSentByEnum;
  form$: ILeadsForm;
  isManualInput = false;
  hasSavedForm = false;
  thread$: IThread;
  subscriptions: Subscription[] = [];
  formSubmission$: ILeadsFormSubmission;
  formFields: ILeadsFormComponent[];
  leadStatus = true;
  leadForm: FormGroup;
  audienceID: number;
  gridAlign = 2;
  messageForm: FormGroup;
  loadingText: '';
  isLoad = false;
  isEdit = true;
  refID: string | null;
  newPicture: string;
  buttonGroupStatus = false;
  pageUsersCount: number;
  chatBoxStatus = false;

  constructor(
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private location: Location,
    private formBuilder: FormBuilder,
    private leadService: LeadsService,
    public translate: TranslateService,
    private pageService: PagesService,
    private pageMembers: PageMemberService,
  ) {}

  view(viewEnum: LeadViewMode): boolean {
    return this.leadViewMode === this.enumLeadViewMode[viewEnum];
  }

  initForm(): void {
    this.messageForm = this.formBuilder.group({
      greeting_message: [''],
      thank_you_message: [''],
      button_input: [''],
      id: [''],
      pageid: [''],
    });
  }
  ngOnInit(): void {
    this.initForm();
    this.pageService.getPictureFromFacebookFanpageByFacebookID().subscribe((urlPicture) => {
      this.newPicture = urlPicture;
    });
    this.routeResolver$.subscribe((resolved: { form: ILeadsFormWithComponents; ref: string }) => {
      this.handleData(resolved);
    });
    this.getPageUsers();
  }
  getPageUsers(): void {
    this.pageMembers.getPageMembersAmountByPageID().subscribe((result) => (this.pageUsersCount = result.amount_of_users));
  }

  chatBoxStatusEvent(event: boolean): void {
    this.chatBoxStatus = event;
  }

  clickOutsideButtonBox(event): void {
    if (event) this.buttonGroupStatus = false;
  }

  activeButtonGroup(): void {
    if (!this.buttonGroupStatus) this.buttonGroupStatus = true;
  }

  deactiveButtonGroup(): void {
    this.buttonGroupStatus = false;
  }

  handleData({ form, ref }: { form: ILeadsFormWithComponents; ref: string }): void {
    this.refID = ref;
    this.leadViewMode = LeadViewMode.CREATE;
    this.disableSaving = true;
    // }

    this.selectedForm = form;
    this.getForm(this.selectedForm.id);

    this.gridAlign += 1;
  }

  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe());
  }

  getForm(ID: number): void {
    const subscription = this.leadService.getFormByID(ID).subscribe(
      (formData: ILeadsFormWithComponents) => {
        const formFieldsData = formData.components;
        const form = new Object();
        this.formFields = formFieldsData.map((field: ILeadsFormComponent) => {
          form[field.options.controlName] = [field?.['value'] ?? '', Validators.required];
          return field;
        });
        this.leadForm = this.formBuilder.group(form);
        Object.keys(this.leadForm.controls).map((key) => {
          this.leadForm.get(key).disable();
        });

        this.setValueIntoForm(formData);
      },
      (err) => this.handleErrors(err),
    );
    this.subscriptions.push(subscription);
  }

  onClickCancel() {
    this.location.back();
  }

  isDisabled(): boolean {
    return Boolean(this.isManualInput === false);
  }

  handleErrors(error): void {
    this.openErrorDialog(error);
  }

  openCopyDialog(link: string) {
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

  setValueIntoForm(formData): void {
    const { id, greeting_message, thank_you_message, button_input } = formData;
    this.messageForm.get('id').setValue(id);
    this.messageForm.get('greeting_message').setValue(greeting_message);
    this.messageForm.get('thank_you_message').setValue(thank_you_message);
    this.messageForm.get('button_input').setValue(button_input);
  }

  openErrorDialog(error): void {
    this.openDialog(
      {
        title: this.translate.instant('Something went wrong'),
        text: this.translate.instant(error),
      },
      true,
    );
  }

  openDialog(data, isErr: boolean) {
    const dialog = this.matDialog.open(SuccessDialogComponent, { width: '422px' });
    dialog.componentInstance['data'] = data;
    dialog.componentInstance.isError = isErr;
  }

  saveMessage() {
    if (this.messageForm.dirty) {
      this.isLoad = true;
      this.leadService.createMessageForm(this.messageForm.value).subscribe(() => {
        this.openSuccessDialog();
        this.isLoad = false;
      });
    }
  }

  onSave(): void {
    if (this.leadViewMode === this.enumLeadViewMode.CREATE) {
      this.saveMessage();
    }
  }
}
