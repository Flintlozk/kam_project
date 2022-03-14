import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import {
  AudienceViewType,
  ChatboxView,
  GenericButtonMode,
  GenericDialogMode,
  IAudience,
  IAudienceContacts,
  IAudienceWithCustomer,
  ILeadsForm,
  ILeadsFormComponent,
  ILeadsFormSubmission,
  ILeadsFormWithComponents,
  IMessageModel,
  IThread,
  MessageSentByEnum,
} from '@reactor-room/itopplus-model-lib';
import { ITextTitle } from '@reactor-room/model-lib';
import { getLeadInfoFormValidators } from '@reactor-room/plusmar-front-end-helpers';
import { TemplatesService } from '@reactor-room/plusmar-front-end-share/components/chatbox/templates/templates.service';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { AudienceHistoryService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience-history.service';
import { MessageService } from '@reactor-room/plusmar-front-end-share/services/facebook/message/message.service';
import { LeadsService } from '@reactor-room/plusmar-front-end-share/services/leads/leads.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { isEmpty } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-leads-info',
  templateUrl: './leads-info.component.html',
  styleUrls: ['./leads-info.component.scss'],
})
export class LeadsInfoComponent implements OnInit, OnDestroy {
  originRoute: AudienceViewType;
  @Input() formID: number;
  @Input() audience: IAudienceWithCustomer;
  @Input() isSave = false;
  available = true;
  messages$: Observable<IMessageModel[]>;
  currentStep$: Observable<IAudience>;
  chatViewMode: ChatboxView = ChatboxView.AUDIENCE;
  disableSaving = false;
  selectedForm: ILeadsFormWithComponents;
  sentBy = MessageSentByEnum;
  form$: ILeadsForm;
  isManualInput = false;
  hasSavedForm = false;
  thread$: IThread;
  subscriptions: Subscription[] = [];
  formFields: ILeadsFormComponent[];
  leadStatus = true;
  leadForm: FormGroup;
  gridAlign = 2;
  user_id: number;
  isLeadFormHaveValue = false;
  isSendLeadFormClicked = false;
  destroy$ = new Subject();
  contactList = [] as IAudienceContacts[];
  isShowEditOptions = true;
  audienceID: number;
  formSubmission$: ILeadsFormSubmission;
  // childAudience$: Observable<IAudience>;
  // parentRouteResolver$ = this.route.parent.data as Observable<AudienceContactResolver>;

  isCustomerFilled = false;

  @Output() closeLead = new EventEmitter<boolean>();
  @Output() changeForm = new EventEmitter<boolean>();

  constructor(
    private dialogService: DialogService,
    private matDialog: MatDialog,
    private formBuilder: FormBuilder,
    private leadService: LeadsService,
    private audienceHistoryService: AudienceHistoryService,
    private messageService: MessageService,
    private userService: UserService,
    private templateService: TemplatesService,
    private toastrService: ToastrService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.getAudienceByID();
    this.getFormByID();
    this.getUser();
    this.leadFormSubmitSubscription();
  }

  getAudienceByID(): void {
    if (!isEmpty(this.audience)) {
      this.audienceID = this.audience.id;
      this.messages$ = this.messageService.getMessages(this.audienceID);
      this.currentStep$ = this.audienceHistoryService.getSteps(this.audienceID);
    } else {
      this.disableSaving = true;
    }
  }

  leadFormSubmitSubscription(): void {
    this.leadService
      .onLeadFormSubmitSubscription(this.audienceID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((leadSubmitData) => {
        this.getFormSubmission(leadSubmitData.id);
      });
  }

  getFormSubmission(formSubmissionID: number): void {
    this.leadService.getFormSubmissionByID(formSubmissionID).subscribe((val) => {
      this.isCustomerFilled = true;
      this.formSubmission$ = val;
      this.getForm(this.formSubmission$.form_id);
    });
  }

  getFormByID(): void {
    this.leadService
      .getFormByID(this.formID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((form) => {
        if (form) {
          this.selectedForm = form;
          this.getForm(this.selectedForm.id);
        }
      });
  }

  getUser(): Subscription {
    return this.userService.$userContext.pipe(takeUntil(this.destroy$)).subscribe(({ id: user_id }) => {
      this.user_id = user_id;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe());
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  fillLeadFormSubs(leadSubmitData: ILeadsFormSubmission): void {
    if (!isEmpty(leadSubmitData)) {
      this.isShowEditOptions = false;
      this.toggleInputs();

      const { options } = leadSubmitData;
      const optionArray = JSON.parse(options);
      const { value: name } = optionArray.find(({ name }) => name === 'name');
      const { value: phone } = optionArray.find(({ name }) => name === 'phoneNumber');
      this.patchLeadFormSubs(name, phone);
    }
  }

  patchLeadFormSubs(name: string, phone: string): void {
    this.leadForm?.get('name').patchValue(name);
    this.leadForm?.get('phoneNumber').patchValue(phone);

    this.showLeadFormAlreadySaved();
  }

  getForm(ID: number): void {
    const subscription = this.leadService
      .getFormByID(ID)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (formData: ILeadsFormWithComponents) => {
          const formFieldsData = formData.components;
          const form = new Object();
          this.formFields = formFieldsData.map((field: ILeadsFormComponent) => {
            form[field.options.controlName] = [field?.['value'] ?? '', getLeadInfoFormValidators(field?.options.validation)];
            return field;
          });

          this.leadForm = this.formBuilder.group(form);
          this.fillLeadFormSubs(this.formSubmission$);
        },
        (err) => this.handleErrors(err),
        () => this.toggleInputs(),
      );

    this.subscriptions.push(subscription);
  }

  onClickCancel(): void {
    this.closeLead.emit(true);
  }
  onChangeForm(): void {
    this.changeForm.emit(true);
  }

  onClickManual(checked: boolean): void {
    if (this.isManualInput !== checked) {
      if (checked) this.gridAlign += 1;
      else this.gridAlign -= 1;
    }
    this.isManualInput = checked;
    this.toggleInputs();
  }

  toggleInputs(): void {
    if (this.leadForm) {
      Object.keys(this.leadForm.controls).map((key) => {
        !this.isManualInput || !this.audience ? this.leadForm.get(key).disable() : this.leadForm.get(key).enable();
      });
    }
  }

  isDisabled(): boolean {
    return Boolean(this.isManualInput === false);
  }

  handleErrors(error: string): void {
    // this.openErrorDialog({ title: '', text: this.translate.instant(error) });
    this.toastrService.error(this.translate.instant(error), this.translate.instant('Lead'));
  }

  openCopyDialog(link: string): void {
    this.openDialog({
      title: 'Copied Successfully',
      text: link,
    });
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

  openErrorDialog(error: ITextTitle): void {
    this.openDialog({
      title: 'Something went wrong...',
      text: error.text,
    });
  }

  openDialog(data: ITextTitle, redirect = false): void {
    const dialog = this.matDialog.open(SuccessDialogComponent, { width: '422px' });
    dialog.componentInstance['data'] = data;
    if (redirect)
      dialog
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.closeLead.emit(true);
        });
  }

  onSave(): void {
    this.createManualLeadForm();
  }

  showLeadFormAlreadySaved(): void {
    const message = this.translate.instant('Customer has filled up the form');
    const title = this.translate.instant('Leads');
    this.toastrService.warning(message, title);
    this.isManualInput = false;
    this.toggleInputs();
    this.hideHeaderMenuButton();
  }

  createManualLeadForm(): void {
    this.leadService
      .createManualLeadForm({
        customerId: this.audience.customer_id,
        audienceId: this.audience.id,
        name: this.selectedForm.name,
        formId: this.formID,
        formJson: JSON.stringify(this.leadForm.value),
        user_id: this.user_id,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.hasSavedForm = true;
          this.isManualInput = false;
          this.isShowEditOptions = false;
          this.toggleInputs();
          // this.hideHeaderMenuButton();
          this.openSuccessDialog();
        },
        (err) => {
          this.handleErrors(err.message);
        },
      );
  }

  saveFormComponents(formID: number): Observable<ILeadsForm | ILeadsForm[]> {
    const components$ = [...this.formFields].map((cmp) => this.leadService.createFormComponent({ ...cmp, form_id: formID }));
    return forkJoin(components$);
  }

  sendFormToChat(formID: number): void {
    this.templateService.changeMessage(formID, 'forms');
    this.messageService.getLeadFormDialogListener$.pipe(takeUntil(this.destroy$)).subscribe((flag) => {
      this.isSendLeadFormClicked = flag;
      if (flag) {
        this.isManualInput = false;
        this.toggleInputs();
      }
    });
  }

  hideHeaderMenuButton(): void {
    const leadFormSubmitted = true;
    this.messageService.setIsLeadFormSubmitted(leadFormSubmitted);
  }

  onClickCancelLeadForm(): void {
    const text = 'Are you sure you want to cancel lead?';
    this.dialogService.openDialog(text, GenericDialogMode.CAUTION, GenericButtonMode.CONFIRM, false, true).subscribe((confirm) => {
      if (confirm) {
        this.leadService.cancelCustomerLead(this.audienceID).subscribe(() => {
          this.onClickCancel();
        });
      }
    });
  }
}
