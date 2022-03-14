import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { EnumConfigGeneral } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'cms-next-setting-website-mobile-view',
  templateUrl: './setting-website-mobile-view.component.html',
  styleUrls: ['./setting-website-mobile-view.component.scss'],
})
export class SettingWebsiteMobileViewComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup;
  @Output() formGroupChange = new EventEmitter<FormGroup>();
  @Output() readyToPatch: EventEmitter<{ name: string }> = new EventEmitter<{ name: string }>();
  mobileHeaderView: FormGroup;
  mobileContentView: FormGroup;
  mobileSidebarView: FormGroup;
  destroy$ = new Subject<void>();
  mobileView: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.mobileView = new FormGroup({});
    this.formCheck();

    this.formGroupChange.emit(this.formGroup);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  formCheck(): void {
    const form = this.formGroup.get('mobile_view') as FormGroup;
    if (_.isEmpty(form)) {
      this.generateMobileContentView();
      this.generateMobileHeaderView();
      this.generateMobileSidebarView();
      this.mobileView.addControl('content', this.mobileContentView);
      this.mobileView.addControl('sidebar_menu', this.mobileSidebarView);
      this.mobileView.addControl('header', this.mobileHeaderView);
      this.formGroup.addControl('mobile_view', this.mobileView);
    } else {
      this.mobileView = form;
      this.mobileContentView = this.formGroup.get('mobile_view.content') as FormGroup;
      this.mobileSidebarView = this.formGroup.get('mobile_view.sidebar_menu') as FormGroup;
      this.mobileHeaderView = this.formGroup.get('mobile_view.header') as FormGroup;
      this.mobileView.setControl('content', this.mobileContentView);
      this.mobileView.setControl('sidebar_menu', this.mobileSidebarView);
      this.mobileView.setControl('header', this.mobileHeaderView);
    }
    this.readyToPatch.emit({ name: EnumConfigGeneral.MOBILE_VIEW });
  }

  generateMobileHeaderView(): void {
    this.mobileHeaderView = this.fb.group({
      fixed_top_menu: [false],
    });
  }
  generateMobileContentView(): void {
    this.mobileContentView = this.fb.group({
      search_button: [false],
      side_information: [false],
      increase_image_size: [false],
    });
  }
  generateMobileSidebarView(): void {
    this.mobileSidebarView = this.fb.group({
      sidebar_menu: [false],
      sidebar_submenu_auto: [false],
    });
  }
}
