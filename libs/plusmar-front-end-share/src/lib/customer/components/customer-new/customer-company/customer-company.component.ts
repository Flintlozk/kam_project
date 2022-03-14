import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { CustomerService } from '@reactor-room/plusmar-front-end-share/services/customer.service';
import { CustomerCompany } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomerCompaniesService } from '../../customer-companies/customer-companies.service';
import { CompaniesDialogComponent } from './companies-dialog/companies-dialog.component';

@Component({
  selector: 'reactor-room-customer-company',
  templateUrl: './customer-company.component.html',
  styleUrls: ['./customer-company.component.scss'],
})
export class CustomerCompanyComponent implements OnInit, OnDestroy {
  form: FormGroup;
  selected: CustomerCompany[];
  inititalSetOfCompanies: CustomerCompany[];
  updated: CustomerCompany[];
  @Input() customerId: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Output() customerCompanies = new EventEmitter<{ selected: CustomerCompany[]; updated: CustomerCompany[] }>();
  constructor(private dialog: MatDialog, private customerService: CustomerService, private ccService: CustomerCompaniesService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: { id: string }) => {
      this.getCustomerCompanyById(+params['id']);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getCustomerCompanyById(id: number): void {
    this.ccService
      .getCustomerAssignedCompanyById(Number(id))
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: CustomerCompany[]) => {
          this.selected = [...result];
          this.inititalSetOfCompanies = [...result];
        },
        (err) => {
          console.log(err);
        },
      );
  }

  trackBy(index: number, el: CustomerCompany): number {
    return el.id;
  }

  editCompaniesDialog(): void {
    const dialogRef = this.dialog.open(CompaniesDialogComponent, {
      width: '100%',
      data: {
        customerId: +this.customerId,
        selected: this.updated?.length ? this.updated : [...this.selected],
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: CustomerCompany[]) => {
        if (result) {
          this.updated = result;
          this.addCompanyToForm({ selected: this.inititalSetOfCompanies, updated: this.updated });
        }
      });
  }

  addCompanyToForm(updateCompanyValue: { selected: CustomerCompany[]; updated: CustomerCompany[] }): void {
    this.customerService
      .upsertCustomerCompany({ id: this.customerId, ...updateCompanyValue })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getCustomerCompanyById(this.customerId);
        this.openSuccessDialog({ text: 'Updated Successfully', title: "Update customer's company" });
      });
  }

  openSuccessDialog(message: { text: string; title: string }, isError = false): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data: { text: 'Updated Successfully', title: "Update customer's company" },
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;
  }

  displayFn(company: CustomerCompany): string {
    return company?.company_name;
  }
}
