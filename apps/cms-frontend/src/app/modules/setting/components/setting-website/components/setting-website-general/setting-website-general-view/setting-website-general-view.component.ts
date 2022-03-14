import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EnumConfigGeneral } from '@reactor-room/cms-models-lib';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { SettingGeneralService } from '../../../../../services/setting-general/setting-general-service';
@Component({
  selector: 'cms-next-setting-website-general-view',
  templateUrl: './setting-website-general-view.component.html',
  styleUrls: ['./setting-website-general-view.component.scss'],
})
export class SettingWebsiteGeneralViewComponent implements OnInit, OnDestroy {
  generalView: FormGroup;
  generalHeaderSettingView: FormGroup;
  generalContentSettingView: FormGroup;
  generalSubSettingView: FormGroup;
  destroy$ = new Subject<void>();
  @Input() formGroup: FormGroup;
  @Output() formGroupChange = new EventEmitter<any>();
  @Output() readyToPatch: EventEmitter<{ name: string }> = new EventEmitter<{ name: string }>();
  constructor(private fb: FormBuilder, private settingService: SettingGeneralService) {}
  get picture_display(): FormGroup {
    return this.formGroup.get('general.view.picture_display_setting') as FormGroup;
  }
  get fixed_top_menu(): FormGroup {
    return this.formGroup.get('general.header.fixed_top_menu_setting') as FormGroup;
  }
  get shop_cart(): FormGroup {
    return this.formGroup.get('general.header.shop_cart_setting') as FormGroup;
  }
  get currency_converter(): FormGroup {
    return this.formGroup.get('general.header.currency_converter_setting') as FormGroup;
  }
  get back_to_top(): FormGroup {
    return this.formGroup.get('general.content.back_to_top_button_setting') as FormGroup;
  }
  get facebook_comment_tab(): FormGroup {
    return this.formGroup.get('general.content.facebook_comment_tab_setting') as FormGroup;
  }
  get advertising_display(): FormGroup {
    return this.formGroup.get('general.content.advertising_display_setting') as FormGroup;
  }
  get loginFormGroup(): FormGroup {
    return this.generalView?.get('login') as FormGroup;
  }
  get notificationFormGroup(): FormGroup {
    return this.generalView?.get('notification') as FormGroup;
  }
  get viewFormGroup(): FormGroup {
    return this.generalView?.get('view') as FormGroup;
  }
  ngOnInit(): void {
    this.generalView = new FormGroup({});
    this.formCheck();

    this.formGroupChange.emit(this.formGroup);
  }
  formCheck(): void {
    const form = this.formGroup.get('general') as FormGroup;
    if (_.isEmpty(form)) {
      this.generateContentSetting();
      this.generateHeaderSetting();
      this.generateSubView();
      this.generalView.addControl('content', this.generalContentSettingView);
      this.generalView.addControl('notification', this.generalSubSettingView.get('notification'));
      this.generalView.addControl('login', this.generalSubSettingView.get('login'));
      this.generalView.addControl('view', this.generalSubSettingView.get('view'));
      this.generalView.addControl('header', this.generalHeaderSettingView);
      this.formGroup.addControl('general', this.generalView);
    } else {
      this.generalView = form;
      this.generalContentSettingView = this.formGroup.get('general.content') as FormGroup;
      this.generalHeaderSettingView = this.formGroup.get('general.header') as FormGroup;
    }

    this.readyToPatch.emit({ name: EnumConfigGeneral.GENERAL_VIEW });
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  generateContentSetting(): void {
    this.generalContentSettingView = this.fb.group({
      scrollbar: [false],
      disable_right_click: [false],
      back_to_top_button: [false],
      back_to_top_button_setting: this.fb.group({
        image_url: [''],
        position: [''],
      }),
      facebook_comment_tab: [false],
      facebook_comment_tab_setting: this.fb.group({
        comment_tab: [false],
        allow_member_only: [false],
      }),
      advertising_display: [false],
      advertising_display_setting: this.fb.group({
        position: [''],
        size: [''],
        upload: this.fb.group({
          image_url: [''],
          link_type: this.fb.group({
            selected_link_type: [''],
            link_types: [[]],
            target_url: [''],
            target_href: this.fb.group({
              selected_target_href: [''],
              target_href: [[]],
            }),
          }),
        }),
        share_clip: this.fb.group({
          embedded_link: [''],
        }),
      }),
      webp_format_system: [false],
      printer: [false],
      preview_custom_form: [false],
    });
  }

  generateHeaderSetting(): void {
    this.generalHeaderSettingView = this.fb.group({
      language_flag: [false],
      fixed_top_menu: [false],
      fixed_top_menu_setting: this.fb.group({
        full_screen: [false],
        image_url: [''],
        link_type: this.fb.group({
          selected_link_type: [''],
          link_types: [[]],
          target_url: [''],
          target_href: this.fb.group({
            selected_target_href: [''],
            target_href: [[]],
          }),
        }),
      }),
      shop_cart: [false],
      shop_cart_setting: this.fb.group({
        shopcart_icon: [0],
        icon_color: this.fb.group({
          rgb: [''],
          alpha: [0],
        }),
        text_color: this.fb.group({
          rgb: [''],
          alpha: [0],
        }),
      }),
      currency_converter: [false],
      currency_converter_setting: this.fb.group({
        main_converter: [''],
        selected_main_converter: this.fb.array([]),
      }),
    });
  }
  generateSubView(): void {
    this.generalSubSettingView = this.fb.group({
      login: this.fb.group({
        social_login: [false],
      }),
      notification: this.fb.group({
        show_as_modal: [false],
      }),
      view: this.fb.group({
        support_responsive: [false],
        picture_display: [false],
        shortened_url_display: [false],
        picture_display_setting: this.fb.group({
          width: [0],
          height: [0],
          units: [''],
          image_url: [''],
          selected_upload: [''],
          image: this.fb.group({
            link_type: this.fb.group({
              selected_link_type: [''],
              link_types: [[]],
              target_url: [''],
              target_href: this.fb.group({
                selected_target_href: [''],
                target_href: [[]],
              }),
            }),
          }),
          end_time: this.fb.group({
            is_active: [false],
            duration: [0],
          }),
          display_on_mobile: this.fb.group({
            is_active: [false],
          }),
        }),
      }),
    });
  }
}
