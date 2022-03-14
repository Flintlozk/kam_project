import { Component, EventEmitter, Input, Output, OnInit, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Action, CrudType, IInsertLeadRespone, ILead, INoteLead, ITagLead } from '@reactor-room/crm-models-lib';
import { map, startWith, take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalErrorComponent } from '../modal-error/modal-error.component';
import { LeadService } from '../../modules/lead/service/lead.service';
import { getUTCDateFromString, NgNeat } from '@reactor-room/itopplus-front-end-helpers';
import { MatMenuTrigger } from '@angular/material/menu';
import { differenceWith, isEqual } from 'lodash';
import { HotToastService } from '@ngneat/hot-toast';
import { IHTTPResult } from '@reactor-room/model-lib';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ModalConfirmDeleteComponent } from '../modal-confirm-delete/modal-confirm-delete.component';

@Component({
  selector: 'reactor-room-lead-form',
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.scss'],
})
export class LeadFormComponent implements OnInit, OnDestroy {
  @Input() sidebar;
  @Input() userRef: ILead;
  @Input() typeOfAction: string;
  @Output() callBack = new EventEmitter<ILead>();
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild(MatMenuTrigger) addTagLead: MatMenuTrigger;

  noteLead: INoteLead[] = [];
  userRefOld: ILead;
  index: number;
  visible = true;
  selectable = true;
  removable = true;
  error: string;
  utcTime: string;
  leadFormInput: FormGroup;
  companyContactList: FormArray;
  tagLeadList: FormArray;
  noteLeadList: FormArray;
  tagInput: FormControl;
  readOnly: boolean;
  businessTypeOptions: string[];
  filteredBusinessTypeOptions: Observable<string[]>;
  errorDialog: MatDialogRef<ModalErrorComponent>;
  seeMoreNoteLead = false;

  tagleadList_Old: ITagLead[];
  TagCompanyFromOwner: ITagLead[];
  TagOptions: string[];
  filteredTagOptions: Observable<string[]>;
  tagByOwnerList: ITagLead[];
  tagLeadListForView: ITagLead[];
  fileData: File;
  fileList: File[] = [];
  noteIndexOld: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  ngNeat: NgNeat;
  hasProjectCode: boolean;
  hasWebsite: boolean;
  projectPrefix;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  indexOfAddressFormGroup = 0;

  get getCompanyContactList() {
    return this.leadFormInput.get('companyContactList') as FormArray;
  }
  get getTagLeadList() {
    return this.leadFormInput.get('tagLeadList') as FormArray;
  }
  get getNoteLeadList() {
    return this.leadFormInput.get('noteLeadList') as FormArray;
  }
  get getAddressList() {
    return this.leadFormInput.get('addressList') as FormArray;
  }
  constructor(private fb: FormBuilder, private LeadServices: LeadService, private ngZone: NgZone, public dialog: MatDialog, public toast: HotToastService) {
    this.ngNeat = new NgNeat(toast);
  }
  ngOnInit(): void {
    this.LeadServices.getLeadSettingsByOwnerId().subscribe((leadSettings) => {
      this.hasProjectCode = leadSettings.hasProjectCode;
      this.hasWebsite = leadSettings.hasWebsite;
      this.projectPrefix = leadSettings.projectPrefix;
    });
    this.index = 0;
    this.leadFormInput = this.fb.group({
      uuidCompany: [''],
      companyname: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      projectNumber: [''],
      companyContactList: this.fb.array([
        this.fb.group({
          uuidname: [''],
          name: ['', [Validators.required]],
          phoneNumber: [''],
          lineId: [''],
          email: [''],
          primarycontact: true,
          position: [''],
          CRUD_TYPE: [''],
        }),
      ]),
      taxIdNo: [''],
      addressList: this.fb.array([
        this.fb.group({
          address: [''],
          postalcode: [''],
          district: [''],
          city: [''],
          province: [''],
          uuidAddress: [''],
        }),
        this.fb.group({
          address: [''],
          postalcode: [''],
          district: [''],
          city: [''],
          province: [''],
          uuidAddress: [''],
        }),
      ]),
      website: [''],
      businesstype: ['', Validators.required],
      tagLeadList: this.fb.array([]),
      noteLeadList: this.fb.array([]),
    });

    this.tagLeadListForView = [];
    this.tagInput = new FormControl('');
    this.LeadServices.getBusinessTypebyOwnerId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (businessTypeList) => {
          this.businessTypeOptions = businessTypeList.map((businesstype) => businesstype.businesstype);
          this.filteredBusinessTypeOptions = this.leadFormInput.controls.businesstype.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterBusinessType(value)),
          );
        },
        (err) => this.openErrorDialog(err),
      );

    this.LeadServices.getTagLeadByOwnerId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (TagOwnerList) => {
          this.tagByOwnerList = TagOwnerList;
          this.TagOptions = TagOwnerList.map((tag) => tag.tagname);
          this.filteredTagOptions = this.tagInput.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterTag(value)),
          );
        },
        (err) => this.openErrorDialog(err),
      );

    if (this.typeOfAction === CrudType.ADD) {
      this.getCompanyContactList.controls[0].patchValue({
        CRUD_TYPE: CrudType.ADD,
      });
      this.createNoteLead();
      this.getNoteLeadList.controls[0].patchValue({ readonly: false });
      this.utcTime = getUTCDateFromString(this.leadFormInput.value.noteLeadList[0].createdate);
    }
    if (this.typeOfAction === CrudType.EDIT) {
      this.LeadServices.getLeadsContactByUUIDCompany(this.userRef.uuidCompany)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (leadList) => {
            this.tagLeadListForView = leadList[0].tagLeadList;
            this.tagLeadListForView.forEach((tag) => {
              tag.CRUD_TYPE = CrudType.NONE;
            });
            this.userRef = leadList[0];
            this.noteLead = this.userRef.noteLeadList;
            this.utcTime = getUTCDateFromString(this.noteLead[0].createdate);
            this.index = 0;
            this.leadFormInput.patchValue({
              uuidCompany: this.userRef.uuidCompany,
              companyname: this.userRef.companyname,
              projectNumber: this.userRef.projectNumber,
              taxIdNo: this.userRef.taxIdNo,
              website: this.userRef.website,
              businesstype: this.userRef.businesstype,
            });

            this.getAddressList.patchValue(this.userRef.addressList);

            const primaryContactList = this.userRef.companyContactList.filter((companyContact) => companyContact.primarycontact === true);
            this.getCompanyContactList.controls[0].patchValue({
              uuidname: primaryContactList[0].uuidname,
              name: primaryContactList[0].name,
              phoneNumber: primaryContactList[0].phoneNumber,
              email: primaryContactList[0].email,
              position: primaryContactList[0].position,
              primarycontact: true,
              CRUD_TYPE: CrudType.EDIT,
              lineId: primaryContactList[0].lineId,
            });

            let i;
            const companyContactList = this.userRef.companyContactList.filter((companyContact) => companyContact.primarycontact === false);
            for (i = 0; i < companyContactList.length; i++) {
              this.createContactPerson();
              this.getCompanyContactList.controls[i + 1].patchValue({
                uuidname: companyContactList[i].uuidname,
                name: companyContactList[i].name,
                phoneNumber: companyContactList[i].phoneNumber,
                email: companyContactList[i].email,
                position: companyContactList[i].position,
                primarycontact: false,
                CRUD_TYPE: CrudType.EDIT,
                lineId: companyContactList[i].lineId,
              });
            }

            let j;
            for (j = 0; j < this.userRef.noteLeadList.length; j++) {
              this.createNoteLead();
              this.getNoteLeadList.controls[j].patchValue({
                notedetail: this.userRef.noteLeadList[j].notedetail,
                uuidnote: this.userRef.noteLeadList[j].uuidnote,
              });
            }
            this.userRefOld = this.leadFormInput.value;
          },
          (err) => this.openErrorDialog(err),
        );
    }
  }

  private _filterBusinessType(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.businessTypeOptions.filter((option) => option.toLowerCase().includes(filterValue));
  }
  private _filterTag(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.TagOptions.filter((option) => option.toLowerCase().includes(filterValue));
  }

  createContactPersonFG(): FormGroup {
    return this.fb.group({
      uuidname: [''],
      name: ['', [Validators.required]],
      phoneNumber: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(3)])],
      email: ['', [Validators.required, Validators.email]],
      primarycontact: false,
      CRUD_TYPE: [CrudType.ADD],
      lineId: ['', Validators.compose([Validators.pattern('^[0-9]*$'), Validators.maxLength[5]])],
      position: ['', [Validators.required]],
    });
  }
  creatTagcompanyFG(): FormGroup {
    return this.fb.group({
      tagname: [''],
      CRUD_TYPE: [CrudType.ADD],
    });
  }
  creatNoteleadFG(): FormGroup {
    return this.fb.group({
      uuidnote: [''],
      notedetail: [''],
      createby: ['kosol'],
      createdate: new Date(),
      updatedate: new Date(),
      readonly: true,
      favourite: true,
    });
  }
  createTagLead(): void {
    this.tagLeadList = this.getTagLeadList;
    this.tagLeadList.push(this.creatTagcompanyFG());
  }
  createContactPerson(): void {
    this.companyContactList = this.getCompanyContactList;
    this.companyContactList.push(this.createContactPersonFG());
  }
  createNoteLead(): void {
    this.noteLeadList = this.getNoteLeadList;
    this.noteLeadList.push(this.creatNoteleadFG());
  }

  onClickCreateContactPerson(): void {
    this.companyContactList = this.getCompanyContactList;
    this.companyContactList.push(this.createContactPersonFG());
    this.onClickchangeTheArrayForm(this.getCompanyContactList.length - 1);
  }

  deleteCompanyContact(): void {
    if (this.index !== 0) {
      this.getCompanyContactList.removeAt(this.index);
    }
    this.onClickchangeTheArrayForm(this.getCompanyContactList.length - 1);
  }

  onClickchangeTheArrayForm(i: number): void {
    this.index = i;
  }

  onSelectedTheTag(event: MatAutocompleteSelectedEvent): void {
    this.tagByOwnerList.filter((tagByOwner) => {
      if (tagByOwner.tagname === event.option.value) {
        if (this.tagLeadListForView.indexOf(tagByOwner) < 0) {
          tagByOwner.CRUD_TYPE = CrudType.ADD;
          this.tagLeadListForView.push(tagByOwner);
        }
      }
    });
    this.tagInput.setValue('');
    this.addTagLead.closeMenu();
  }

  onClickRemoveTagLead(tag: ITagLead): void {
    const index = this.tagLeadListForView.indexOf(tag);
    this.tagLeadListForView[index].CRUD_TYPE = CrudType.DELETE;
  }

  triggerResize(): void {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  onUploadFileAttach(event: any): void {
    this.fileData = <File>event.target.files[0];
    this.fileList.push(this.fileData);
  }
  onRemoveFileAttach(filename): void {
    this.fileList.splice(filename.index, 1);
  }
  onClickEditNote(index: number): void {
    if (this.noteIndexOld > -1) {
      this.getNoteLeadList.controls[this.noteIndexOld].patchValue({
        readonly: true,
      });
    }
    this.getNoteLeadList.controls[index].patchValue({
      readonly: false,
    });
    this.noteIndexOld = index;
  }

  onSubmit(): void {
    if (this.noteIndexOld > -1) {
      this.getNoteLeadList.controls[this.noteIndexOld].patchValue({
        readonly: true,
      });
    }

    if (this.typeOfAction === CrudType.ADD) {
      let i;
      for (i = 0; i < this.tagLeadListForView.length; i++) {
        this.createTagLead();
        this.getTagLeadList.controls[i].patchValue({
          tagname: this.tagLeadListForView[i].tagname,
        });
      }
      this.LeadServices.insertCompanyContact(this.leadFormInput.value)
        .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
        .subscribe(
          (insertRespone: IInsertLeadRespone) => {
            if (insertRespone) {
              this.sidebar.toggle();
              if (this.fileList.length > 0) {
                this.LeadServices.multipleUpload(this.fileList, { uuidCompany: insertRespone.uuidCompany })
                  .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
                  .subscribe(
                    () => {},
                    (err) => this.openErrorDialog(err),
                  );
              }
              this.leadFormInput.value.uuidCompany = insertRespone.uuidCompany;
              this.leadFormInput.value.createBy = insertRespone.createBy;
              this.leadFormInput.value.profilePic = insertRespone.profilePic;

              this.importLeadCallBack(this.leadFormInput.value);
            }
          },
          (err) => this.openErrorDialog(err),
        );
      this.getTagLeadList.clear();
    }

    if (this.typeOfAction === CrudType.EDIT) {
      const returnLeadInput = this.leadFormInput.value;
      returnLeadInput.uuidCompany = this.userRefOld.uuidCompany;
      const updateContactList = this.leadFormInput.value.companyContactList;
      const updateContact = differenceWith(this.leadFormInput.value.companyContactList, this.userRefOld.companyContactList, isEqual);
      const deleteContact = differenceWith(this.userRefOld.companyContactList, this.leadFormInput.value.companyContactList, isEqual);
      const sumContact = updateContact;
      const uuidName = updateContact.map((contact) => contact.uuidname);
      if (deleteContact.length > 0) {
        deleteContact.forEach((contact) => {
          if (!uuidName.includes(contact.uuidname)) {
            contact.CRUD_TYPE = CrudType.DELETE;
            sumContact.push(contact);
          }
        });
      }
      this.getCompanyContactList.clear();
      let i;
      for (i = 0; i < updateContact.length; i++) {
        this.createContactPerson();
      }
      this.getCompanyContactList.setValue(sumContact);
      let j;
      for (j = 0; j < this.tagLeadListForView.length; j++) {
        this.createTagLead();
        this.getTagLeadList.controls[j].patchValue({
          tagname: this.tagLeadListForView[j].tagname,
          CRUD_TYPE: this.tagLeadListForView[j].CRUD_TYPE,
        });
      }
      this.LeadServices.updateCompanyContact(this.leadFormInput.value)
        .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
        .subscribe(
          (serverResponse: IHTTPResult) => {
            if (serverResponse.status === 200) {
              this.importLeadCallBack(returnLeadInput);
              this.sidebar.toggle();
            }
          },
          (err) => {
            this.openErrorDialog(err);
          },
        );
      this.getTagLeadList.clear();
      this.getCompanyContactList.clear();
      for (i = 0; i < updateContactList.length; i++) {
        this.createContactPerson();
      }
      this.leadFormInput.controls.companyContactList.setValue(updateContactList);
    }
  }

  openErrorDialog(err: string): void {
    this.dialog.open(ModalErrorComponent, {
      data: {
        text: err,
      },
    });
  }

  importLeadCallBack(user: ILead): void {
    this.callBack.emit(user);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  styleClickObject(i) {
    if (this.index === i) {
      return { ['border-bottom']: '3px solid lightgreen' };
    }
  }
  onAddLeadTag(event: MatChipInputEvent): void {
    this.tagLeadListForView.push({ tagname: event.value, CRUD_TYPE: CrudType.ADD, tagcolor: '', tagownerid: 0 });
    const input = event.input;
    if (input) {
      input.value = '';
    }
  }
  onClickInvoicingAddress(): void {
    this.indexOfAddressFormGroup = 0;
  }
  onClickDeliveryAddress(): void {
    this.indexOfAddressFormGroup = 1;
  }
  onClickDeleteContact(): void {
    const dialogRef = this.dialog.open(ModalConfirmDeleteComponent, {
      data: {
        title: 'CompanyContact',
      },
    });
    dialogRef.afterClosed().subscribe((actionDialog) => {
      if (actionDialog === Action.CONFIRM) {
        this.deleteCompanyContact();
      }
    });
  }
}
