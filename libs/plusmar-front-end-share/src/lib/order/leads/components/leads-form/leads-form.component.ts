import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LeadsService } from '@reactor-room/plusmar-front-end-share/services/leads/leads.service';
import { ILeadFormPage, ILeadsForm, IPages } from '@reactor-room/itopplus-model-lib';
import { toLower } from 'lodash';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';

@Component({
  selector: 'reactor-room-leads-form',
  templateUrl: './leads-form.component.html',
  styleUrls: ['./leads-form.component.scss'],
})
export class LeadsFormComponent implements OnInit {
  forms$ = this.leadService.getForms();
  routeResolver$ = this.route.data;
  page: IPages;
  tableHeader: ITableHeader[] = [
    { sort: false, title: this.translate.instant('Form'), key: null },
    { sort: false, title: this.translate.instant('Created At'), key: null },
    { sort: false, title: this.translate.instant('Action'), key: null },
  ];

  tableData = [{ title: 'Name, Phone No., Remark' }];
  toastPosition = 'toast-bottom-right';

  constructor(
    private toastr: ToastrService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private leadService: LeadsService,
    private clipboardService: ClipboardService,
  ) {}

  ngOnInit(): void {
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.routeResolver$.subscribe((resolved) => this.handleData(resolved as ILeadFormPage));
  }

  handleData({ page }: ILeadFormPage): void {
    this.page = page;
  }

  copyReferralLink(form: ILeadsForm): void {
    this.leadService
      .getFormReferral(form.id)
      .pipe(switchMap(({ ref }) => of(this.clipboardService.copyFromContent(this.getRefLink(ref)))))
      .subscribe(
        () => null,
        () => null,
        () => {
          this.toastr.success(this.translate.instant('Referral Link Copied'), this.translate.instant('Copied'), { positionClass: this.toastPosition });
          console.log('Content copied to your clipboard');
        },
      );
  }

  viewFormPreview(form: ILeadsForm): void {
    void this.router.navigate(['/leads/edit-form', { formID: form.id }]);
  }

  getRefLink(ref: string): string {
    let referralLink = '';
    if (this.page.page_username === null) {
      const sanitizedName = toLower(String(this.page.page_name).split(' ').join('.'));
      referralLink = `http://m.me/${sanitizedName}-${this.page.fb_page_id}?ref=${ref}`;
    } else {
      referralLink = `http://m.me/${this.page.page_username}?ref=${ref}`;
    }
    return referralLink;
  }

  trackBy(index: number, el: { id: number }): number {
    return el.id;
  }
}
