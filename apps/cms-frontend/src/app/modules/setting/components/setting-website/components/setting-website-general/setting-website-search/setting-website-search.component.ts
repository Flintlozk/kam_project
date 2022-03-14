import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EnumConfigGeneral } from '@reactor-room/cms-models-lib';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-next-setting-website-search',
  templateUrl: './setting-website-search.component.html',
  styleUrls: ['./setting-website-search.component.scss'],
})
export class SettingWebsiteSearchComponent implements OnInit, OnDestroy {
  max_search_results: number[];
  search_types: string[];
  search: FormGroup;
  destroy$ = new Subject<void>();
  isLandingPage = false;
  @Input() formGroup: FormGroup;
  @Output() formGroupChange = new EventEmitter<any>();
  @Output() readyToPatch: EventEmitter<{ name: string }> = new EventEmitter<{ name: string }>();

  constructor(private fb: FormBuilder) {}

  get getSelectedMaximumSearchResult(): FormControl {
    return this.search.get('maximun_search_results.selected_maximum_result') as FormControl;
  }
  get getSearchType(): FormControl {
    return this.search.get('search_type.default_search_type') as FormControl;
  }
  ngOnInit(): void {
    this.formCheck();
  }
  formCheck(): void {
    const form = this.formGroup.get('search') as FormGroup;
    if (_.isEmpty(form)) {
      this.generateSearchView();
      this.formGroup.addControl('search', this.search);
    } else {
      this.search = form;
    }
    this.readyToPatch.emit({ name: EnumConfigGeneral.SEARCH });
  }
  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  generateSearchView(): void {
    this.search = this.fb.group({
      maximun_search_results: this.fb.group({
        selected_maximum_result: [0],
        maximum_results: [[]],
      }),
      define_search_score: [0],
      search_pattern: this.fb.group({
        pattern_index: [0],
      }),
      search_pattern_setting: this.fb.group({
        button: this.fb.group({
          selected_button: [''],
          button_types: this.fb.array([]),
        }),
        search_icon: this.fb.group({
          selected_search_icon: [''],
          search_icons: this.fb.array([]),
        }),
        icon_color: this.fb.group({
          rgb: [''],
          alpha: [0],
        }),
        text_color: this.fb.group({
          rgb: [''],
          alpha: [0],
        }),
        background_color: this.fb.group({
          alpha: [''],
          type: [''],
          solid: this.fb.group({
            rgb: [''],
            alpha: [0],
          }),
          linear: this.fb.group({
            rgb: this.fb.array([]),
            alpha: [0],
          }),
          image: this.fb.group({
            url: [''],
            alpha: [0],
          }),
        }),
      }),
      search_landing_page: this.fb.group({
        landing_page_index: [0],
      }),
      search_type: this.fb.group({
        default_search_type: [''],
        search_types: [[]],
      }),
    });
  }
}
